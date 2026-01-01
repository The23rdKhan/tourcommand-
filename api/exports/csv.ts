import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError } from '../_helpers';
import { NotFoundError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'GET') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    const { tourId } = req.query;

    if (!tourId || typeof tourId !== 'string') {
      throw new Error('tourId is required');
    }

    // Verify tour ownership
    const { data: tour } = await supabase
      .from('tours')
      .select('id, name')
      .eq('id', tourId)
      .eq('user_id', userId)
      .single();

    if (!tour) {
      throw new NotFoundError('Tour');
    }

    // Get all shows for the tour
    const { data: shows, error } = await supabase
      .from('shows')
      .select('*')
      .eq('tour_id', tourId)
      .order('date', { ascending: true });

    if (error) throw error;

    // Generate CSV
    const headers = ['Date', 'City', 'Venue', 'Status', 'Deal', 'Guarantee', 'Expenses', 'Net Profit'];
    const rows = (shows || []).map((s: any) => {
      const expenses = Object.values(s.financials.expenses || {}).reduce((a: number, b: number) => a + b, 0);
      const revenue = s.financials.guarantee + (s.financials.ticketPrice * s.financials.soldCount) + s.financials.merchSales;
      const profit = revenue - expenses;
      return [
        s.date,
        `"${s.city}"`,
        `"${s.venue}"`,
        s.status,
        s.deal_type,
        s.financials.guarantee,
        expenses,
        profit
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = `${tour.name.replace(/\s+/g, '_')}_Report.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);

  } catch (error) {
    handleApiError(error, res);
  }
}


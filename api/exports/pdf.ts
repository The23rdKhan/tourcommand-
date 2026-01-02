import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError } from '../_helpers';
import { NotFoundError, SubscriptionError } from '../../lib/errors';
import { hasFeature } from '../../lib/subscription';
import PDFDocument from 'pdfkit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'GET') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    // Check subscription tier
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (!hasFeature(profile?.tier || 'Free', 'pdfExport')) {
      throw new SubscriptionError('PDF export requires Pro or Agency subscription');
    }

    const { tourId } = req.query;

    if (!tourId || typeof tourId !== 'string') {
      throw new Error('tourId is required');
    }

    // Verify tour ownership and get data
    const { data: tour } = await supabase
      .from('tours')
      .select('id, name, artist, start_date, end_date, region, currency')
      .eq('id', tourId)
      .eq('user_id', userId)
      .single();

    if (!tour) {
      throw new NotFoundError('Tour');
    }

    const { data: shows } = await supabase
      .from('shows')
      .select('*')
      .eq('tour_id', tourId)
      .order('date', { ascending: true });

    if (!shows) {
      throw new Error('Failed to fetch shows');
    }

    // Generate PDF using Promise-based approach for serverless
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // PDF Content
      doc.fontSize(24).text(tour.name, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Artist: ${tour.artist}`, { align: 'center' });
      doc.text(`Region: ${tour.region} | Currency: ${tour.currency}`, { align: 'center' });
      doc.text(`Dates: ${new Date(tour.start_date).toLocaleDateString()} - ${new Date(tour.end_date).toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Financial Summary
      let totalRevenue = 0;
      let totalExpenses = 0;
      shows.forEach((show: any) => {
        const financials = show.financials || {};
        const expenses = (Object.values(financials.expenses || {}) as number[]).reduce((a: number, b: number) => a + b, 0);
        const revenue = (financials.guarantee || 0) + 
                       ((financials.ticketPrice || 0) * (financials.soldCount || 0)) + 
                       (financials.merchSales || 0);
        totalRevenue += revenue;
        totalExpenses += expenses;
      });

      doc.fontSize(18).text('Financial Summary', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Total Revenue: ${tour.currency} ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      doc.text(`Total Expenses: ${tour.currency} ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      doc.text(`Net Profit: ${tour.currency} ${(totalRevenue - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, { 
        color: (totalRevenue - totalExpenses) >= 0 ? 'green' : 'red'
      });
      doc.moveDown(2);

      // Shows Table
      if (shows.length > 0) {
        doc.fontSize(18).text('Shows', { underline: true });
        doc.moveDown();

        // Table Header
        doc.fontSize(10).font('Helvetica-Bold');
        const startX = 50;
        let y = doc.y;
        doc.text('Date', startX, y);
        doc.text('City', startX + 100, y);
        doc.text('Venue', startX + 200, y);
        doc.text('Status', startX + 300, y);
        doc.text('Revenue', startX + 380, y);
        doc.text('Profit', startX + 460, y);
        
        y += 20;
        doc.moveTo(startX, y).lineTo(550, y).stroke();
        y += 10;

        // Table Rows
        doc.font('Helvetica');
        shows.forEach((show: any) => {
          const financials = show.financials || {};
          const expenses = (Object.values(financials.expenses || {}) as number[]).reduce((a: number, b: number) => a + b, 0);
          const revenue = (financials.guarantee || 0) + 
                         ((financials.ticketPrice || 0) * (financials.soldCount || 0)) + 
                         (financials.merchSales || 0);
          const profit = revenue - expenses;

          doc.fontSize(9);
          doc.text(new Date(show.date).toLocaleDateString(), startX, y);
          doc.text(show.city || 'N/A', startX + 100, y, { width: 90 });
          doc.text(show.venue || 'N/A', startX + 200, y, { width: 90 });
          doc.text(show.status || 'Draft', startX + 300, y, { width: 70 });
          doc.text(`${tour.currency} ${revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, startX + 380, y);
          doc.text(`${tour.currency} ${profit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, startX + 460, y, {
            color: profit >= 0 ? 'green' : 'red'
          });
          
          y += 15;
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
        });
      } else {
        doc.fontSize(12).text('No shows found for this tour.');
      }

      doc.end();
    });

    // Send PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${tour.name.replace(/[^a-z0-9]/gi, '_')}_Report.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.send(pdfBuffer);

  } catch (error) {
    handleApiError(error, res);
  }
}


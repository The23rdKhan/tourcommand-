import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { ShowSchema, type CreateShowRequest } from '../../lib/validations';
import { AuthorizationError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);
    const tourId = req.query.tourId as string;

    if (req.method === 'GET') {
      if (!tourId) {
        throw new Error('tourId is required');
      }

      // Verify tour ownership
      const { data: tour } = await supabase
        .from('tours')
        .select('id')
        .eq('id', tourId)
        .eq('user_id', userId)
        .single();

      if (!tour) {
        throw new AuthorizationError('Tour not found or access denied');
      }

      const { data: shows, error } = await supabase
        .from('shows')
        .select('*')
        .eq('tour_id', tourId)
        .order('date', { ascending: true });

      if (error) throw error;
      sendResponse(res, shows || []);
      return;
    }

    if (req.method === 'POST') {
      const body = ShowSchema.parse(req.body);

      // Verify tour ownership
      const { data: tour } = await supabase
        .from('tours')
        .select('id')
        .eq('id', body.tourId)
        .eq('user_id', userId)
        .single();

      if (!tour) {
        throw new AuthorizationError('Tour not found or access denied');
      }

      const showId = body.id || `s-${Date.now()}`;
      const { data: show, error } = await supabase
        .from('shows')
        .insert({
          id: showId,
          tour_id: body.tourId,
          date: body.date,
          city: body.city,
          venue: body.venue,
          venue_id: body.venueId,
          status: body.status,
          deal_type: body.dealType,
          financials: body.financials,
          logistics: body.logistics,
          travel: body.travel,
          notes: body.notes
        })
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, show, 201);
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


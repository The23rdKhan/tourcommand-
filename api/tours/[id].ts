import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { TourSchema, type UpdateTourRequest } from '../../lib/validations';
import { NotFoundError, AuthorizationError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new Error('Tour ID is required');
    }

    if (req.method === 'GET') {
      const { data: tour, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !tour) {
        throw new NotFoundError('Tour');
      }

      sendResponse(res, tour);
      return;
    }

    if (req.method === 'PUT') {
      // Verify ownership
      const { data: existingTour } = await supabase
        .from('tours')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingTour) {
        throw new NotFoundError('Tour');
      }

      if (existingTour.user_id !== userId) {
        throw new AuthorizationError();
      }

      const body = TourSchema.partial().parse(req.body);
      const { data: tour, error } = await supabase
        .from('tours')
        .update({
          name: body.name,
          artist: body.artist,
          start_date: body.startDate,
          end_date: body.endDate,
          region: body.region,
          tour_manager: body.tourManager,
          booking_agent: body.bookingAgent,
          currency: body.currency
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, tour);
      return;
    }

    if (req.method === 'DELETE') {
      // Verify ownership
      const { data: existingTour } = await supabase
        .from('tours')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingTour) {
        throw new NotFoundError('Tour');
      }

      if (existingTour.user_id !== userId) {
        throw new AuthorizationError();
      }

      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);

      if (error) throw error;
      sendResponse(res, { deleted: true });
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


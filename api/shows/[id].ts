import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { ShowSchema } from '../../lib/validations';
import { NotFoundError, AuthorizationError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new Error('Show ID is required');
    }

    if (req.method === 'GET') {
      // Get show and verify access through tour ownership
      const { data: show, error } = await supabase
        .from('shows')
        .select(`
          *,
          tours!inner(user_id)
        `)
        .eq('id', id)
        .eq('tours.user_id', userId)
        .single();

      if (error || !show) {
        throw new NotFoundError('Show');
      }

      sendResponse(res, show);
      return;
    }

    if (req.method === 'PUT') {
      // Verify access through tour ownership
      const { data: existingShow } = await supabase
        .from('shows')
        .select(`
          tour_id,
          tours!inner(user_id)
        `)
        .eq('id', id)
        .eq('tours.user_id', userId)
        .single();

      if (!existingShow) {
        throw new NotFoundError('Show');
      }

      const body = ShowSchema.partial().parse(req.body);
      const { data: show, error } = await supabase
        .from('shows')
        .update({
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
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, show);
      return;
    }

    if (req.method === 'DELETE') {
      // Verify access through tour ownership
      const { data: existingShow } = await supabase
        .from('shows')
        .select(`
          tour_id,
          tours!inner(user_id)
        `)
        .eq('id', id)
        .eq('tours.user_id', userId)
        .single();

      if (!existingShow) {
        throw new NotFoundError('Show');
      }

      const { error } = await supabase
        .from('shows')
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


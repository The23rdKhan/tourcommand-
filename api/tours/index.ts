import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { TourSchema, type CreateTourRequest } from '../../lib/validations';
import { checkTierLimit } from '../../lib/subscription';
import { ValidationError, SubscriptionError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method === 'GET') {
      // List all tours for user
      const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      sendResponse(res, tours || []);
      return;
    }

    if (req.method === 'POST') {
      // Create new tour
      const body = TourSchema.parse(req.body);
      
      // Check subscription tier limits
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', userId)
        .single();

      const { count } = await supabase
        .from('tours')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!checkTierLimit(profile?.tier || 'Free', count || 0, 'tours')) {
        throw new SubscriptionError('Tour limit reached. Upgrade to Pro for unlimited tours.');
      }

      const tourId = `t-${Date.now()}`;
      const { data: tour, error } = await supabase
        .from('tours')
        .insert({
          id: tourId,
          user_id: userId,
          name: body.name,
          artist: body.artist,
          start_date: body.startDate,
          end_date: body.endDate,
          region: body.region,
          tour_manager: body.tourManager,
          booking_agent: body.bookingAgent,
          currency: body.currency
        })
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, tour, 201);
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


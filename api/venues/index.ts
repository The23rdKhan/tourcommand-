import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { VenueSchema, type CreateVenueRequest } from '../../lib/validations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method === 'GET') {
      const { data: venues, error } = await supabase
        .from('venues')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      sendResponse(res, venues || []);
      return;
    }

    if (req.method === 'POST') {
      const body = VenueSchema.parse(req.body);
      const venueId = body.id || `v-${Date.now()}`;
      
      const { data: venue, error } = await supabase
        .from('venues')
        .insert({
          id: venueId,
          user_id: userId,
          name: body.name,
          city: body.city,
          capacity: body.capacity,
          contact_name: body.contactName,
          contact_email: body.contactEmail,
          notes: body.notes
        })
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, venue, 201);
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


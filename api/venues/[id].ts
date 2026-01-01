import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { VenueSchema } from '../../lib/validations';
import { NotFoundError, AuthorizationError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new Error('Venue ID is required');
    }

    if (req.method === 'GET') {
      const { data: venue, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !venue) {
        throw new NotFoundError('Venue');
      }

      sendResponse(res, venue);
      return;
    }

    if (req.method === 'PUT') {
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingVenue) {
        throw new NotFoundError('Venue');
      }

      if (existingVenue.user_id !== userId) {
        throw new AuthorizationError();
      }

      const body = VenueSchema.partial().parse(req.body);
      const { data: venue, error } = await supabase
        .from('venues')
        .update({
          name: body.name,
          city: body.city,
          capacity: body.capacity,
          contact_name: body.contactName,
          contact_email: body.contactEmail,
          notes: body.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, venue);
      return;
    }

    if (req.method === 'DELETE') {
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingVenue) {
        throw new NotFoundError('Venue');
      }

      if (existingVenue.user_id !== userId) {
        throw new AuthorizationError();
      }

      const { error } = await supabase
        .from('venues')
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


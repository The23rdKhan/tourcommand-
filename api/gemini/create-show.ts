import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { createServerClient } from '../../lib/supabase-server';
import { ShowSchema } from '../../lib/validations';
import { ShowStatus, DealType } from '../../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    const { tourId, city, date, venue, guarantee } = req.body;

    if (!tourId || !city || !date) {
      throw new Error('tourId, city, and date are required');
    }

    // Verify tour ownership
    const { data: tour } = await supabase
      .from('tours')
      .select('id')
      .eq('id', tourId)
      .eq('user_id', userId)
      .single();

    if (!tour) {
      throw new Error('Tour not found or access denied');
    }

    const showId = `s-${Date.now()}`;
    const showData = {
      id: showId,
      tourId: tourId,
      date: date,
      city: city,
      venue: venue || 'TBD Venue',
      status: ShowStatus.DRAFT,
      dealType: DealType.GUARANTEE,
      financials: {
        guarantee: guarantee || 0,
        ticketPrice: 0,
        soldCount: 0,
        capacity: 0,
        expenses: { venue: 0, production: 0, travel: 0, hotels: 0, marketing: 0, misc: 0 },
        merchSales: 0
      }
    };

    const validated = ShowSchema.parse(showData);

    const { data: show, error } = await supabase
      .from('shows')
      .insert({
        id: validated.id,
        tour_id: validated.tourId,
        date: validated.date,
        city: validated.city,
        venue: validated.venue,
        venue_id: validated.venueId,
        status: validated.status,
        deal_type: validated.dealType,
        financials: validated.financials,
        logistics: validated.logistics,
        travel: validated.travel,
        notes: validated.notes
      })
      .select()
      .single();

    if (error) throw error;
    sendResponse(res, show, 201);

  } catch (error) {
    handleApiError(error, res);
  }
}


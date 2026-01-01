import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { NotFoundError, SubscriptionError } from '../../lib/errors';
import { hasFeature } from '../../lib/subscription';
import { randomBytes } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    // Check subscription tier
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (!hasFeature(profile?.tier || 'Free', 'shareableLinks')) {
      throw new SubscriptionError('Shareable links require Pro or Agency subscription');
    }

    const { tourId, expiresInDays = 30 } = req.body;

    if (!tourId || typeof tourId !== 'string') {
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
      throw new NotFoundError('Tour');
    }

    // Generate unique token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data: sharedLink, error } = await supabase
      .from('shared_tour_links')
      .insert({
        tour_id: tourId,
        token,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/shared/${token}`;

    sendResponse(res, {
      ...sharedLink,
      shareUrl
    }, 201);

  } catch (error) {
    handleApiError(error, res);
  }
}


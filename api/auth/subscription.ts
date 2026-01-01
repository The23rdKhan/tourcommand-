import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import type { SubscriptionTier } from '../../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method === 'GET') {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      // Also get tier from user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', userId)
        .single();

      sendResponse(res, {
        tier: profile?.tier || 'Free',
        subscription: subscription || null
      });
      return;
    }

    if (req.method === 'PUT') {
      const { tier } = req.body as { tier: SubscriptionTier };

      if (!['Free', 'Pro', 'Agency'].includes(tier)) {
        throw new Error('Invalid tier');
      }

      // Update user profile tier
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .update({ tier })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) throw profileError;

      // Update or create subscription record
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .update({ tier, status: tier === 'Free' ? 'canceled' : 'active' })
          .eq('user_id', userId)
          .select()
          .single();

        if (subError) throw subError;
        sendResponse(res, { tier, subscription });
      } else {
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            tier,
            status: tier === 'Free' ? 'canceled' : 'active'
          })
          .select()
          .single();

        if (subError) throw subError;
        sendResponse(res, { tier, subscription });
      }
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


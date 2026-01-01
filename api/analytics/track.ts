import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { AnalyticsEventSchema } from '../../lib/validations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    const body = AnalyticsEventSchema.parse(req.body);

    const { data: event, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: body.eventName,
        properties: body.properties || {}
      })
      .select()
      .single();

    if (error) throw error;
    sendResponse(res, event, 201);

  } catch (error) {
    handleApiError(error, res);
  }
}


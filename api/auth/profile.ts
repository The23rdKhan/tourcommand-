import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { UserProfileSchema } from '../../lib/validations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method === 'GET') {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      sendResponse(res, profile);
      return;
    }

    if (req.method === 'PUT') {
      const body = UserProfileSchema.partial().parse(req.body);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({
          name: body.name,
          email: body.email,
          role: body.role,
          tier: body.tier
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, profile);
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


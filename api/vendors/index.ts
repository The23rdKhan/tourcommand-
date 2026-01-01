import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { VendorSchema, type CreateVendorRequest } from '../../lib/validations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method === 'GET') {
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      sendResponse(res, vendors || []);
      return;
    }

    if (req.method === 'POST') {
      const body = VendorSchema.parse(req.body);
      const vendorId = body.id || `vdr-${Date.now()}`;
      
      const { data: vendor, error } = await supabase
        .from('vendors')
        .insert({
          id: vendorId,
          user_id: userId,
          name: body.name,
          role: body.role,
          city: body.city,
          poc_name: body.pocName,
          poc_email: body.pocEmail,
          poc_phone: body.pocPhone,
          requires_permits: body.requiresPermits,
          notes: body.notes
        })
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, vendor, 201);
      return;
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    handleApiError(error, res);
  }
}


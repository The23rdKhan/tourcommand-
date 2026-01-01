import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { VendorSchema } from '../../lib/validations';
import { NotFoundError, AuthorizationError } from '../../lib/errors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new Error('Vendor ID is required');
    }

    if (req.method === 'GET') {
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !vendor) {
        throw new NotFoundError('Vendor');
      }

      sendResponse(res, vendor);
      return;
    }

    if (req.method === 'PUT') {
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingVendor) {
        throw new NotFoundError('Vendor');
      }

      if (existingVendor.user_id !== userId) {
        throw new AuthorizationError();
      }

      const body = VendorSchema.partial().parse(req.body);
      const { data: vendor, error } = await supabase
        .from('vendors')
        .update({
          name: body.name,
          role: body.role,
          city: body.city,
          poc_name: body.pocName,
          poc_email: body.pocEmail,
          poc_phone: body.pocPhone,
          requires_permits: body.requiresPermits,
          notes: body.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      sendResponse(res, vendor);
      return;
    }

    if (req.method === 'DELETE') {
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingVendor) {
        throw new NotFoundError('Vendor');
      }

      if (existingVendor.user_id !== userId) {
        throw new AuthorizationError();
      }

      const { error } = await supabase
        .from('vendors')
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


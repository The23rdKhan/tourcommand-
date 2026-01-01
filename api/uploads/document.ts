import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { createServerClient } from '../../lib/supabase-server';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    // This is a simplified version. In production, you'd need to handle multipart/form-data
    // using a library like `formidable` or `multer`
    const { tourId, fileName, fileData, fileType } = req.body;

    if (!tourId || !fileName || !fileData) {
      throw new Error('tourId, fileName, and fileData are required');
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

    // Upload to Supabase Storage
    const filePath = `${userId}/${tourId}/${Date.now()}_${fileName}`;
    const fileBuffer = Buffer.from(fileData, 'base64');

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('tour-documents')
      .upload(filePath, fileBuffer, {
        contentType: fileType || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('tour-documents')
      .getPublicUrl(filePath);

    sendResponse(res, {
      filePath,
      publicUrl,
      fileName,
      uploadedAt: new Date().toISOString()
    }, 201);

  } catch (error) {
    handleApiError(error, res);
  }
}


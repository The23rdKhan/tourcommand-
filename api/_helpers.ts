// Shared helper functions for API routes

import { createServerClient } from '../../lib/supabase-server';
import { AuthenticationError, AuthorizationError, createErrorResponse, createSuccessResponse } from '../../lib/errors';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function authenticateRequest(req: VercelRequest): Promise<{ supabase: any; userId: string }> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  const supabase = createServerClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return { supabase, userId: user.id };
}

export function handleApiError(error: unknown, res: VercelResponse): void {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    const errorResponse = createErrorResponse(error);
    const statusCode = error instanceof AuthenticationError ? 401 :
                      error instanceof AuthorizationError ? 403 :
                      error.name === 'ValidationError' ? 400 : 500;
    
    res.status(statusCode).json(errorResponse);
  } else {
    res.status(500).json(createErrorResponse(new Error('Unknown error occurred')));
  }
}

export function sendResponse<T>(res: VercelResponse, data: T, statusCode: number = 200): void {
  res.status(statusCode).json(createSuccessResponse(data));
}


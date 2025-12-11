import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import type { CustomError } from '../types/index.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authenticateSupabaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('No token provided') as CustomError;
      err.status = 401;
      throw err;
    }

    const token = authHeader.substring(7); 

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      const err = new Error('Invalid or expired token') as CustomError;
      err.status = 401;
      throw err;
    }

   
    req.user = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split('@')[0]
    };

    next();
  } catch (error) {
    next(error);
  }
};
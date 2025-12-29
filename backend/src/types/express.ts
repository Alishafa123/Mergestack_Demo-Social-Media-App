import { Request } from 'express';

/**
 * Custom Express types for authentication
 * 
 * Usage:
 * 1. For routes that may or may not have authentication, use regular Request
 * 2. For routes that require authentication, use type assertion: req as AuthenticatedRequest
 * 
 * Example:
 * ```typescript
 * import { Request, Response, NextFunction } from 'express';
 * import type { AuthenticatedRequest } from '@/types/index.js';
 * 
 * export const createPost = async (req: Request, res: Response, next: NextFunction) => {
 *   const authReq = req as AuthenticatedRequest;
 *   const userId = authReq.user.id; // Type-safe access to user
 *   // ... rest of the function
 * };
 * ```
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Custom Request interface that ensures user is always present
// Use this with type assertion: req as AuthenticatedRequest
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export default {};

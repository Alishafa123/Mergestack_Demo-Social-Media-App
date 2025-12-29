import { Request } from 'express';


export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export default {};

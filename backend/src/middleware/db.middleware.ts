import { Request, Response, NextFunction } from 'express';
import { connectDB } from '@config/database';

export const ensureDBConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

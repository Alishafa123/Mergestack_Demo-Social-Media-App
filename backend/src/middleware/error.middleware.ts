import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export default function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

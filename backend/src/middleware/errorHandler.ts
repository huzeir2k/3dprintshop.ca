import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.status === 400) {
    return res.status(400).json({ success: false, error: err.message, details: err.details });
  }

  if (err.status === 404) {
    return res.status(404).json({ success: false, error: 'Not found' });
  }

  if (err.status === 409) {
    return res.status(409).json({ success: false, error: err.message });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

export class AppError extends Error {
  constructor(public message: string, public status: number, public details?: any) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

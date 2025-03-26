import { Request, Response, NextFunction } from 'express';
import ApiError from '../../exceptions/auth-error';

export function ErrorMiddleware(
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (this) {
    if (this.err instanceof ApiError) {
      return res
        .status(this.err.status)
        .json({ message: this.err.message, errors: this.err.errors });
    }
    return res.status(500).json({ message: 'Unhandled error' });
  } else {
    next();
  }
}

import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/errorType.js';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      message: err.message,
      error: err.error,
    });
  }
  //unhandled error
  return res.status(503).json({
    message: 'Service unavailable',
    error: String(err),
  });
};

export default errorHandler;

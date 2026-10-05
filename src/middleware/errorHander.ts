import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types/response.js';
const errorHandler = (err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(err.status).json({
    message: err.message,
    error: err.error,
  });
};

export default errorHandler;

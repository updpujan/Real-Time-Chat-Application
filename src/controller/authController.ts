import { NextFunction, Request, Response } from 'express';
import register from '../service/auth/registration.js';
import { ErrorResponse, SuccessResponse } from '../types/response.js';

export const registerController = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const response: SuccessResponse = await register(req.body);
    return res.status(response.status).json({
      message: response.message,
    });
  } catch (err) {
    const error: ErrorResponse = {
      status: 503,
      message: 'db service unavaliable',
      error: err,
    };
    return _next(error);
  }
};

export const loginController = () => {};

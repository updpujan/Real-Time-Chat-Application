import { NextFunction, Request, Response } from 'express';

import register from '../service/auth/registration.js';
import login from '../service/auth/login.js';
import { SuccessResponse } from '../types/response.js';
import User from '../models/users.js';
import { AppError } from '../errors/errorType.js';

export const registerController = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const response: SuccessResponse = await register(req.body);
    return res.status(response.status).json({
      message: response.message,
    });
  } catch (err) {
    return _next(err);
  }
};

export const loginController = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const response: SuccessResponse<User> = await login(req.body.email, req.body.password);
    const id = response.data?.dataValues.id;
    req.session.userId = Number(id);
    return res.status(response.status).json({
      message: response.message,
    });
  } catch (err) {
    return _next(err);
  }
};

export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    if (!req.session.userId) {
      throw new AppError({ status: 401, message: 'User not Authenticated' });
    }
    req.session.destroy((error) => {
      if (error) {
        throw new AppError({ status: 503, message: 'Failed to destroy session', error });
      }
      res.clearCookie('connect.sid');

      return res.status(200).json({
        message: 'Logout sucessfully',
      });
    });
  } catch (err) {
    return _next(err);
  }
};

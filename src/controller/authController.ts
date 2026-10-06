import { NextFunction, Request, Response } from 'express';

import register from '../service/auth/registration.js';
import login from '../service/auth/login.js';
import { SuccessResponse } from '../types/response.js';
import User from '../models/users.js';

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

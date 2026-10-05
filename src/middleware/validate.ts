import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../schema/auth/registration.js';
import { ErrorResponse } from '../types/response.js';
import { getUserByEmail } from '../repository/auth/getUser.js';

export const registerValidate = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body) {
    const error: ErrorResponse = {
      status: 400,
      message: 'No data in body',
    };
    return next(error);
  }
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    const error: ErrorResponse = {
      status: 400,
      message: 'Validation Error',
      error: result.error.issues.map((err) => err.message),
    };
    return next(error);
  }
  req.body = result.data;
  return next();
};

//Email validation
export const emailValidate = async (req: Request, _res: Response, next: NextFunction) => {
  const result = await getUserByEmail(req.body.email);
  if (result) {
    const error: ErrorResponse = {
      status: 409,
      message: 'User already exists',
    };
    return next(error);
  }
  return next();
};

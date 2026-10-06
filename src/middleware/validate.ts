import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../schema/auth/registration.js';
import { loginSchema } from '../schema/auth/loginSchema.js';
import { getUserByEmail } from '../repository/auth/getUser.js';
import { AppError } from '../errors/errorType.js';

export const registerValidate = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new AppError({ status: 400, message: 'No data in body' });
  }
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError({
      status: 400,
      message: 'Validation Error',
      error: result.error.issues.map((err) => err.message),
    });
  }
  req.body = result.data;
  return next();
};

//Email validation
export const emailValidate = async (req: Request, _res: Response, next: NextFunction) => {
  const result = await getUserByEmail(req.body.email);
  if (result) {
    throw new AppError({ status: 409, message: 'User already exists' });
  }
  return next();
};

export const loginValidate = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new AppError({ status: 400, message: 'No data in body' });
  }
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError({
      status: 400,
      message: 'Validation Error',
      error: result.error.issues.map((err) => err.message),
    });
  }
  req.body.email = result.data.email;
  return next();
};

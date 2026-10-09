import type { Request, Response, NextFunction } from 'express';
import User from '../models/users.js';
import { AppError } from '../errors/errorType.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      throw new AppError({ status: 401, message: 'Authentication Required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError({ status: 401, message: 'User account no longer exists' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

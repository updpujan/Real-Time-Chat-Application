import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/errorType.js';
import { chatSearchQuerySchema } from '../schema/websocket/privateMessageSchema.js';
import { searchChat } from '../service/chat/searchConversation.js';

const searchCOnversationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryResult = chatSearchQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      throw new AppError({
        status: 400,
        message: 'Invalid search query',
        error: queryResult.error.issues,
      });
    }

    const currentUserId = Number(req.session.userId);

    if (!Number.isSafeInteger(currentUserId) || currentUserId <= 0) {
      throw new AppError({
        status: 401,
        message: 'Authentication required',
      });
    }

    const result = await searchChat({
      currentUserId,
      query: queryResult.data.q,
    });

    res.status(200).json({
      message: 'Search results retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default searchCOnversationController;

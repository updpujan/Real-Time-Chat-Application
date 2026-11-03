import type { RequestHandler } from 'express';
import { getUserConversations } from '../../service/chat/conversation.js';
import { AppError } from '../../errors/errorType.js';
import logger from '../../config/logger.js';

export const getConversations: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (userId === undefined) {
      throw new AppError({ status: 401, message: 'user is not authentcated' });
    }

    const conversations = await getUserConversations(userId);

    logger.info('chat conversatoin retrived sucess', { status: 200, userId: userId });
    res.status(200).json({
      status: 200,
      message: 'Chat list retrieved successfully',
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

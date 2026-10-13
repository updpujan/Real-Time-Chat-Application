import type { Request, Response, NextFunction } from 'express';
import User from '../../models/users.js';
import { deletePrivateMessage, getPrivateMessages } from '../../service/messageService.js';
import {
  deleteMessageParamsSchema,
  messageHistoryParamsSchema,
  messageHistoryQuerySchema,
} from '../../schema/websocket/privateMessageSchema.js';
import { AppError } from '../../errors/errorType.js';

export const getchatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsResult = messageHistoryParamsSchema.safeParse(req.params);
    const queryResult = messageHistoryQuerySchema.safeParse(req.query);

    if (!paramsResult.success || !queryResult.success) {
      throw new AppError({
        status: 400,
        message: 'Invalid Request Parameter',
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.issues),
          ...(queryResult.success ? [] : queryResult.error.issues),
        ],
      });
    }

    const currentUserId = Number(req.session.userId);
    if (!currentUserId) {
      throw new AppError({ status: 401, message: 'Authentication required' });
    }
    const otherUserId = paramsResult.data.userId;
    const { limit, offset } = queryResult.data;

    if (currentUserId === otherUserId) {
      throw new AppError({ status: 400, message: 'No chat between same user' });
    }

    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id'],
    });

    if (!otherUser) {
      throw new AppError({ status: 404, message: 'User not found' });
    }

    const result = await getPrivateMessages({
      currentUserId,
      otherUserId,
      limit,
      offset,
    });

    res.status(200).json({
      message: 'Conversation history retrieved successfully',
      data: result.messages,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChatMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = deleteMessageParamsSchema.safeParse(req.params);
    if (!messageId.success) {
      throw new AppError({ status: 400, message: 'Invalid message id' });
    }
    const senderId = req.session.userId;
    if (!senderId) {
      throw new AppError({ status: 401, message: 'Authentication required' });
    }
    const result = await deletePrivateMessage(messageId.data.messId, senderId);

    if (!result.success) {
      throw new AppError({ status: 404, message: result.reason });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

import type { Request, Response, NextFunction } from 'express';
import User from '../../models/users.js';
import Room from '../../models/room.js';
import RoomMember from '../../models/roomMembers.js';
import {
  deletePrivateMessage,
  getPrivateMessages,
  getGroupMessages,
} from '../../service/messageService.js';
import {
  deleteMessageParamsSchema,
  messageHistoryParamsSchema,
  messageHistoryQuerySchema,
} from '../../schema/websocket/privateMessageSchema.js';
import { AppError } from '../../errors/errorType.js';

export const getchatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paramsResult = messageHistoryParamsSchema.safeParse(req.params);
    const queryResult = messageHistoryQuerySchema.safeParse(req.query);

    if (!paramsResult.success || !queryResult.success) {
      throw new AppError({
        status: 400,
        message: 'Invalid request parameters',
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.issues),
          ...(queryResult.success ? [] : queryResult.error.issues),
        ],
      });
    }

    const currentUserId = req.session.userId;

    if (!currentUserId) {
      throw new AppError({
        status: 401,
        message: 'Authentication required',
      });
    }

    const { type, id } = paramsResult.data;
    const { limit, offset } = queryResult.data;

    if (type === 'private') {
      if (currentUserId === id) {
        throw new AppError({
          status: 400,
          message: 'Cannot retrieve a private chat with yourself',
        });
      }

      const otherUser = await User.findByPk(id, {
        attributes: ['id'],
      });

      if (!otherUser) {
        throw new AppError({
          status: 404,
          message: 'User not found',
        });
      }

      const result = await getPrivateMessages({
        currentUserId,
        otherUserId: id,
        limit,
        offset,
      });

      res.status(200).json({
        status: 200,
        message: 'Private conversation history retrieved successfully',
        data: result.messages,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.hasMore,
        },
      });

      return;
    }

    const room = await Room.findByPk(id, {
      attributes: ['id'],
    });

    if (!room) {
      throw new AppError({
        status: 404,
        message: 'Room not found',
      });
    }

    const membership = await RoomMember.findOne({
      where: {
        userId: currentUserId,
        roomId: id,
      },
      attributes: ['roomId'],
    });

    if (!membership) {
      throw new AppError({
        status: 403,
        message: 'You are not a member of this room',
      });
    }

    const result = await getGroupMessages({
      roomId: id,
      limit,
      offset,
    });

    res.status(200).json({
      status: 200,
      message: 'Group conversation history retrieved successfully',
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

import { Request, Response, NextFunction } from 'express';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getMyRooms,
} from '../../service/chat/room/roomService.js';

import { createRoomSchema, joinRoomSchema } from '../../schema/websocket/roomSchema.js';
import { AppError } from '../../errors/errorType.js';

export const createRoomController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomInput = createRoomSchema.safeParse(req.body);
    if (!roomInput.success) {
      throw new AppError({
        status: 400,
        message: 'Invalid Request Parameter',
        error: [...roomInput.error.issues],
      });
    }
    const currentUserId = Number(req.session.userId);

    const room = await createRoom(currentUserId, roomInput.data);
    return res.status(201).json({
      message: 'Room create sucessfully',
      data: room.dataValues,
    });
  } catch (err) {
    next(err);
  }
};

export const joinRoomController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const joinRoomVal = joinRoomSchema.safeParse(Number(req.params.roomId));

    if (!joinRoomVal.success) {
      throw new AppError({
        status: 400,
        message: 'paramter validation error',
        error: [...joinRoomVal.error.issues],
      });
    }

    const userId = Number(req.session.userId);
    const membership = await joinRoom(joinRoomVal.data, userId);
    return res.status(201).json({
      message: 'Room joined sucessfully',
      data: membership.dataValues,
    });
  } catch (err) {
    next(err);
  }
};

export const leaveRoomController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaveRoomVal = joinRoomSchema.safeParse(Number(req.params.roomId));
    if (!leaveRoomVal.success) {
      throw new AppError({
        status: 400,
        message: 'validation error',
        error: leaveRoomVal.error?.issues,
      });
    }
    const userId = Number(req.session.userId);
    await leaveRoom(leaveRoomVal.data, userId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getMyRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.session.userId);
    const rooms = await getMyRooms(userId);

    return res.status(200).json({
      status: 200,
      message: 'Rooms retrieved successfully',
      data: rooms,
    });
  } catch (err) {
    next(err);
  }
};

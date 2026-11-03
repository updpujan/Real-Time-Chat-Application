import { createRoom, joinRoom, leaveRoom, getMyRooms, } from '../../service/chat/room/roomService.js';
import { createRoomSchema, joinRoomSchema } from '../../schema/websocket/roomSchema.js';
import { AppError } from '../../errors/errorType.js';
import { notifyRoomJoined, notifyRoomLeft } from '../../websocket/roomMembershipEvents.js';
import redis from '../../config/redis.js';
import logger from '../../config/logger.js';
export const createRoomController = async (req, res, next) => {
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
        logger.info('room created sucessfully Sucessfully', {
            status: 201,
            roomId: room.dataValues.id,
            creater: room.dataValues.createdBy,
        });
        return res.status(201).json({
            message: 'Room create sucessfully',
            data: room.dataValues,
        });
    }
    catch (err) {
        next(err);
    }
};
export const joinRoomController = async (req, res, next) => {
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
        notifyRoomJoined(userId, joinRoomVal.data);
        logger.info('room joined Sucessfully', {
            status: 201,
            roomId: membership.dataValues.roomId,
            userId: membership.dataValues.userId,
        });
        return res.status(201).json({
            message: 'Room joined sucessfully',
            data: membership.dataValues,
        });
    }
    catch (err) {
        next(err);
    }
};
export const leaveRoomController = async (req, res, next) => {
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
        notifyRoomLeft(userId, leaveRoomVal.data);
        logger.info('room left Sucessfully', {
            status: 204,
            roomId: leaveRoomVal.data,
            userId: userId,
        });
        return res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
export const getMyRoom = async (req, res, next) => {
    try {
        const userId = Number(req.session.userId);
        const cacheKey = String(userId);
        if (redis.isReady) {
            const cachedRoom = await redis.get(cacheKey);
            if (cachedRoom !== null) {
                logger.info('Rooms retrived sucessfully-redis', { status: 200, userId: userId });
                return res.status(200).json({
                    status: 200,
                    message: 'Rooms retrieved successfully',
                    data: JSON.parse(cachedRoom),
                });
            }
        }
        const rooms = await getMyRooms(userId);
        await redis.set(cacheKey, JSON.stringify(rooms), {
            EX: 300,
        });
        logger.info('Rooms retrived sucessfully-db', { status: 200, userId: userId });
        return res.status(200).json({
            status: 200,
            message: 'Rooms retrieved successfully',
            data: rooms,
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=roomController.js.map
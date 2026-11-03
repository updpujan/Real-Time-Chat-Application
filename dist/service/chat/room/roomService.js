import RoomMember from '../../../models/roomMembers.js';
import { AppError } from '../../../errors/errorType.js';
import sequelize from '../../../config/database.js';
import Room from '../../../models/room.js';
import { syncUserRoomConnections } from '../../roomServices.js';
export const canUserAccessRoom = async (userId, roomId) => {
    const room = await Room.findByPk(roomId);
    if (!room) {
        return {
            allowed: false,
            reason: 'ROOM_NOT_FOUND',
        };
    }
    const member = await RoomMember.findOne({
        where: {
            roomId,
            userId,
        },
    });
    if (!member) {
        return {
            allowed: false,
            reason: 'NOT_MEMBER',
        };
    }
    return { allowed: true };
};
export const createRoom = async (creatorId, input) => {
    return sequelize.transaction(async (transaction) => {
        const room = await Room.create({
            name: input.name,
            createdBy: creatorId,
            ...(input.maxMembers !== undefined && {
                maxMembers: input.maxMembers,
            }),
        }, { transaction });
        await RoomMember.create({
            roomId: room.id,
            userId: creatorId,
            joinedAt: new Date(),
        }, { transaction });
        return room;
    });
};
export const joinRoom = async (roomId, userId) => {
    return sequelize.transaction(async (transaction) => {
        const room = await Room.findByPk(roomId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!room) {
            throw new AppError({ status: 404, message: 'Room not found' });
        }
        const exestingMembership = await RoomMember.findOne({
            where: { roomId, userId },
            transaction,
        });
        if (exestingMembership) {
            throw new AppError({ status: 409, message: 'User already a member for this room' });
        }
        const memberCount = await RoomMember.count({
            where: { roomId },
            transaction,
        });
        if (memberCount >= room.maxMembers) {
            throw new AppError({ status: 409, message: 'Max Room Capacity exceeds' });
        }
        const membership = await RoomMember.create({ roomId, userId }, { transaction });
        syncUserRoomConnections(userId, roomId, 'join');
        return membership;
    });
};
export const leaveRoom = async (roomId, userId) => {
    return sequelize.transaction(async (transaction) => {
        const room = await Room.findByPk(roomId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!room) {
            throw new AppError({ status: 404, message: 'Room not found' });
        }
        const exestingMembership = await RoomMember.findOne({
            where: { roomId, userId },
            transaction,
        });
        if (!exestingMembership) {
            throw new AppError({ status: 400, message: 'Not a mbember of this room' });
        }
        if (room.createdBy == userId) {
            throw new AppError({ status: 409, message: 'Cannot leave room beofre room owner transfer' });
        }
        await exestingMembership.destroy({ transaction });
        syncUserRoomConnections(userId, roomId, 'leave');
        return;
    });
};
export const getMyRooms = async (userId) => {
    const membership = await RoomMember.findAll({
        where: { userId },
        attributes: ['roomId', 'joinedAt'],
        include: [
            {
                model: Room,
                as: 'room',
                attributes: ['id', 'name', 'createdBy', 'maxMembers', 'createdAt'],
            },
        ],
        order: [['joinedAt', 'DESC']],
    });
    return membership;
};
//# sourceMappingURL=roomService.js.map
import RoomMember from '../../../models/roomMembers.js';
import { AppError } from '../../../errors/errorType.js';
import sequelize from '../../../config/database.js';
import Room from '../../../models/room.js';
import type { CreateRoomInput } from '../../../schema/websocket/roomSchema.js';

interface RoomAccessResult {
  allowed: boolean;
  reason?: 'ROOM_NOT_FOUND' | 'NOT_MEMBER';
}

export const canUserAccessRoom = async (
  userId: number,
  roomId: number,
): Promise<RoomAccessResult> => {
  const room = await RoomMember.findByPk(roomId);
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

export const createRoom = async (creatorId: number, input: CreateRoomInput) => {
  return sequelize.transaction(async (transaction) => {
    const room = await Room.create(
      {
        name: input.name,
        createdBy: creatorId,
        ...(input.maxMembers !== undefined && {
          maxMembers: input.maxMembers,
        }),
      },
      { transaction },
    );

    await RoomMember.create(
      {
        roomId: room.id,
        userId: creatorId,
        joinedAt: new Date(),
      },
      { transaction },
    );

    return room;
  });
};

export const joinRoom = async (roomId: number, userId: number) => {
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

    return membership;
  });
};

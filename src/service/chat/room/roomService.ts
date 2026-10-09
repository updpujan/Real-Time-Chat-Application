import RoomMember from '../../../models/roomMembers.js';

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

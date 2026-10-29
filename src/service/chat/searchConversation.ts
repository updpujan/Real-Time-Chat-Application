import { Op } from 'sequelize';

import User from '../../models/users.js';
import Room from '../../models/room.js';
import RoomMember from '../../models/roomMembers.js';

interface SearchChatOptions {
  currentUserId: number;
  query: string;
}

export const searchChat = async ({ currentUserId, query }: SearchChatOptions) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return {
      people: [],
      groups: [],
    };
  }

  const people = await User.findAll({
    where: {
      id: {
        [Op.ne]: currentUserId,
      },
      name: {
        [Op.iLike]: `${searchTerm}%`,
      },
    },
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
    limit: 10,
  });

  const rooms = await Room.findAll({
    where: {
      name: {
        [Op.iLike]: `${searchTerm}%`,
      },
    },
    attributes: ['id', 'name', 'maxMembers'],
    order: [['name', 'ASC']],
    limit: 10,
  });

  const groups = await Promise.all(
    rooms.map(async (room) => {
      const [memberCount, membership] = await Promise.all([
        RoomMember.count({
          where: {
            roomId: room.id,
          },
        }),
        RoomMember.findOne({
          where: {
            roomId: room.id,
            userId: currentUserId,
          },
          attributes: ['roomId'],
        }),
      ]);

      const maxMembers = room.maxMembers;

      return {
        id: room.id,
        name: room.name,
        memberCount,
        maxMembers,
        isFull: memberCount >= maxMembers,
        isMember: Boolean(membership),
      };
    }),
  );

  return {
    people,
    groups,
  };
};

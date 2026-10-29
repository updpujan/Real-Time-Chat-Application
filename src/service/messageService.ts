import User from '../models/users.js';
import Message from '../models/message.js';
import { canUserAccessRoom } from './chat/room/roomService.js';
import { Op } from 'sequelize';
import type { PrivateMessageInput } from '../schema/websocket/privateMessageSchema.js';

type SendPrivateMessageResult =
  | { success: true; message: Message }
  | {
      success: false;
      reason: 'RECIPIENT_NOT_FOUND' | 'CANNOT_MESSAGE_SELF';
    };

export const sendPrivateMessage = async (
  senderId: number,
  input: PrivateMessageInput,
): Promise<SendPrivateMessageResult> => {
  if (senderId === input.receiverId) {
    return {
      success: false,
      reason: 'CANNOT_MESSAGE_SELF',
    };
  }

  const recipient = await User.findByPk(input.receiverId, {
    attributes: ['id'],
  });

  if (!recipient) {
    return {
      success: false,
      reason: 'RECIPIENT_NOT_FOUND',
    };
  }

  const message = await Message.create({
    senderId,
    receiverId: input.receiverId,
    roomId: null,
    content: input.content,
  });

  return {
    success: true,
    message,
  };
};

interface GetPrivateMessagesOptions {
  currentUserId: number;
  otherUserId: number;
  limit: number;
  offset: number;
}

interface GetGroupMessagesOptions {
  roomId: number;
  limit: number;
  offset: number;
}

export const getPrivateMessages = async ({
  currentUserId,
  otherUserId,
  limit,
  offset,
}: GetPrivateMessagesOptions) => {
  const { count, rows } = await Message.findAndCountAll({
    where: {
      roomId: null,
      [Op.or]: [
        {
          senderId: currentUserId,
          receiverId: otherUserId,
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId,
        },
      ],
    },
    attributes: ['id', 'senderId', 'receiverId', 'content', 'createdAt'],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
    limit,
    offset,
  });

  return {
    messages: rows,
    total: count,
    limit,
    offset,
    hasMore: offset + rows.length < count,
  };
};

export const getGroupMessages = async ({ roomId, limit, offset }: GetGroupMessagesOptions) => {
  const { count, rows } = await Message.findAndCountAll({
    where: {
      roomId,
    },
    attributes: ['id', 'senderId', 'receiverId', 'roomId', 'content', 'createdAt'],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
    limit,
    offset,
  });

  return {
    messages: rows,
    total: count,
    limit,
    offset,
    hasMore: offset + rows.length < count,
  };
};

type DeleteMessageResult = { success: true } | { success: false; reason: 'NOT_FOUND' };

export const deletePrivateMessage = async (
  messageId: number,
  senderId: number,
): Promise<DeleteMessageResult> => {
  const message = await Message.findOne({
    where: {
      id: messageId,
      senderId,
      roomId: null,
      receiverId: {
        [Op.not]: null,
      },
    },
  });

  if (!message) {
    return { success: false, reason: 'NOT_FOUND' };
  }
  await message.destroy();
  return { success: true };
};

export const sendRoomMessage = async (senderId: number, roomId: number, content: string) => {
  const access = await canUserAccessRoom(senderId, roomId);

  if (!access.allowed) {
    return {
      success: false as const,
      reason:
        access.reason === 'ROOM_NOT_FOUND' ? 'Room not found' : 'You are not a member of this room',
    };
  }

  const message = await Message.create({
    senderId,
    roomId,
    receiverId: null,
    content,
  });

  return {
    success: true as const,
    message,
  };
};

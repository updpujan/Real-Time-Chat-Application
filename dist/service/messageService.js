import User from '../models/users.js';
import Message from '../models/message.js';
import { canUserAccessRoom } from './chat/room/roomService.js';
import { Op } from 'sequelize';
export const sendPrivateMessage = async (senderId, input) => {
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
export const getPrivateMessages = async ({ currentUserId, otherUserId, limit, offset, }) => {
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
export const getGroupMessages = async ({ roomId, limit, offset }) => {
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
export const deletePrivateMessage = async (messageId, senderId) => {
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
export const sendRoomMessage = async (senderId, roomId, content) => {
    const access = await canUserAccessRoom(senderId, roomId);
    if (!access.allowed) {
        return {
            success: false,
            reason: access.reason === 'ROOM_NOT_FOUND' ? 'Room not found' : 'You are not a member of this room',
        };
    }
    const message = await Message.create({
        senderId,
        roomId,
        receiverId: null,
        content,
    });
    return {
        success: true,
        message,
    };
};
//# sourceMappingURL=messageService.js.map
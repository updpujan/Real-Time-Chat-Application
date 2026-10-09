import User from '../models/users.js';
import Message from '../models/message.js';
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

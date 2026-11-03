import Message from '../models/message.js';
import type { PrivateMessageInput } from '../schema/websocket/privateMessageSchema.js';
type SendPrivateMessageResult = {
    success: true;
    message: Message;
} | {
    success: false;
    reason: 'RECIPIENT_NOT_FOUND' | 'CANNOT_MESSAGE_SELF';
};
export declare const sendPrivateMessage: (senderId: number, input: PrivateMessageInput) => Promise<SendPrivateMessageResult>;
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
export declare const getPrivateMessages: ({ currentUserId, otherUserId, limit, offset, }: GetPrivateMessagesOptions) => Promise<{
    messages: Message[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}>;
export declare const getGroupMessages: ({ roomId, limit, offset }: GetGroupMessagesOptions) => Promise<{
    messages: Message[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}>;
type DeleteMessageResult = {
    success: true;
} | {
    success: false;
    reason: 'NOT_FOUND';
};
export declare const deletePrivateMessage: (messageId: number, senderId: number) => Promise<DeleteMessageResult>;
export declare const sendRoomMessage: (senderId: number, roomId: number, content: string) => Promise<{
    success: false;
    reason: string;
    message?: never;
} | {
    success: true;
    message: Message;
    reason?: never;
}>;
export {};
//# sourceMappingURL=messageService.d.ts.map
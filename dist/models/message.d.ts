import { Model, Optional } from 'sequelize';
interface MessageAttributes {
    id: number;
    senderId: number;
    roomId: number | null;
    receiverId: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'roomId' | 'receiverId' | 'createdAt' | 'updatedAt'>;
declare class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    id: number;
    senderId: number;
    roomId: number | null;
    receiverId: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export default Message;
//# sourceMappingURL=message.d.ts.map
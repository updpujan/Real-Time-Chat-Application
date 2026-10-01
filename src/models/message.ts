import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface MessageAttributes {
  id: number;
  senderId: number;
  roomId: number | null;
  receiverId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

type MessageCreationAttributes = Optional<
  MessageAttributes,
  'id' | 'roomId' | 'receiverId' | 'createdAt' | 'updatedAt'
>;

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  declare id: number;
  declare senderId: number;
  declare roomId: number | null;
  declare receiverId: number | null;
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sender_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },

    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'room_id',
      references: {
        model: 'rooms',
        key: 'id',
      },
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'receiver_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
  },
);

export default Message;

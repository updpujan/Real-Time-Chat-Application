import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface RoomMemberAttributes {
  id: number;
  roomId: number;
  userId: number;
  joinedAt: Date;
}

type RoomMemberCreationAttributes = Optional<RoomMemberAttributes, 'id' | 'joinedAt'>;

class RoomMember
  extends Model<RoomMemberAttributes, RoomMemberCreationAttributes>
  implements RoomMemberAttributes
{
  declare id: number;
  declare roomId: number;
  declare userId: number;
  declare joinedAt: Date;
}

RoomMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'room_id',
      references: {
        model: 'rooms',
        key: 'id',
      },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },

    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'joined_at',
    },
  },
  {
    sequelize,
    tableName: 'room_members',
    timestamps: false,
  },
);

export default RoomMember;

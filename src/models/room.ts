import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface RoomAttributes {
  id: number;
  name: string;
  createdBy: number;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

type RoomCreationAttributes = Optional<
  RoomAttributes,
  'id' | 'maxMembers' | 'createdAt' | 'updatedAt'
>;

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  declare id: number;
  declare name: string;
  declare createdBy: number;
  declare maxMembers: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },

    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: 'max_members',
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
    tableName: 'rooms',
    timestamps: true,
  },
);

export default Room;

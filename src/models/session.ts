import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface SessionAttributes {
  sid: string;
  expires: Date;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

type SessionCreationAttributes = Optional<SessionAttributes, 'createdAt' | 'updatedAt'>;

class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  declare sid: string;
  declare expires: Date;
  declare data: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Session.init(
  {
    sid: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },

    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    data: {
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
    tableName: 'sessions',
    timestamps: true,
  },
);

export default Session;

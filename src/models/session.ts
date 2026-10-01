import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface SessionAttributes {
  id: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type SessionCreationAttributes = Optional<SessionAttributes, 'createdAt' | 'updatedAt'>;

class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  declare id: string;
  declare userId: number;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
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

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
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

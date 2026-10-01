import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Session extends Model {
}
Session.init({
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
}, {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
});
export default Session;
//# sourceMappingURL=session.js.map
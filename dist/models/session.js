import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Session extends Model {
}
Session.init({
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
}, {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
});
export default Session;
//# sourceMappingURL=session.js.map
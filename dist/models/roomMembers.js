import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class RoomMember extends Model {
}
RoomMember.init({
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
}, {
    sequelize,
    tableName: 'room_members',
    timestamps: false,
});
export default RoomMember;
//# sourceMappingURL=roomMembers.js.map
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Message extends Model {
}
Message.init({
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
}, {
    sequelize,
    tableName: 'messages',
    timestamps: true,
});
export default Message;
//# sourceMappingURL=message.js.map
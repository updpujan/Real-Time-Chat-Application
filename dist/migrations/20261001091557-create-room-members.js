import { DataTypes } from 'sequelize';
export async function up(queryInterface) {
    await queryInterface.createTable('room_members', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
    await queryInterface.addConstraint('room_members', {
        fields: ['room_id', 'user_id'],
        type: 'unique',
        name: 'unique_room_member',
    });
}
export async function down(queryInterface) {
    await queryInterface.dropTable('room_members');
}
//# sourceMappingURL=20261001091557-create-room-members.js.map
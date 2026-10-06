import { DataTypes } from 'sequelize';
export async function up(queryInterface) {
    await queryInterface.createTable('sessions', {
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
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
}
export async function down(queryInterface) {
    await queryInterface.dropTable('sessions');
}
//# sourceMappingURL=20261001091454-create-sessions.js.map
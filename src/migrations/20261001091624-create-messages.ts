import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.sequelize.query(`
    ALTER TABLE "messages"
    ADD CONSTRAINT "message_room_or_receiver_check"
    CHECK (
      (room_id IS NOT NULL AND receiver_id IS NULL)
      OR
      (room_id IS NULL AND receiver_id IS NOT NULL)
    );
  `);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('messages');
  await queryInterface.sequelize.query(`
    ALTER TABLE "messages"
    DROP CONSTRAINT IF EXISTS "message_room_or_receiver_check";
  `);

  await queryInterface.dropTable('messages');
}

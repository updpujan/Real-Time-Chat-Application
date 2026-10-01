import { Table, TableForeignKey, TableUnique, TableCheck } from 'typeorm';
export class CreateChatTable1790840563452 {
    async up(queryRunner) {
        // Create rooms table
        await queryRunner.createTable(new Table({
            name: 'rooms',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'identity',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'created_by',
                    type: 'integer',
                },
                {
                    name: 'max_members',
                    type: 'integer',
                    default: 50,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        // Create room_members table
        await queryRunner.createTable(new Table({
            name: 'room_members',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'identity',
                },
                {
                    name: 'room_id',
                    type: 'integer',
                },
                {
                    name: 'user_id',
                    type: 'integer',
                },
                {
                    name: 'joined_at',
                    type: 'timestamptz',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        // Create messages table
        await queryRunner.createTable(new Table({
            name: 'messages',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'identity',
                },
                {
                    name: 'sender_id',
                    type: 'integer',
                },
                {
                    name: 'room_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'receiver_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        //message check constraint
        await queryRunner.createCheckConstraint('messages', new TableCheck({
            name: 'CHK_messages_room_or_receiver',
            expression: '(room_id IS NOT NULL AND receiver_id IS NULL) OR (room_id IS NULL AND receiver_id IS NOT NULL)',
        }));
        // rooms.created_by → users.id
        await queryRunner.createForeignKey('rooms', new TableForeignKey({
            name: 'FK_rooms_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        }));
        // room_members.user_id → users.id
        await queryRunner.createForeignKey('room_members', new TableForeignKey({
            name: 'FK_room_members_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        // room_members.room_id → rooms.id
        await queryRunner.createForeignKey('room_members', new TableForeignKey({
            name: 'FK_room_members_room',
            columnNames: ['room_id'],
            referencedTableName: 'rooms',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        // messages.sender_id → users.id
        await queryRunner.createForeignKey('messages', new TableForeignKey({
            name: 'FK_messages_sender',
            columnNames: ['sender_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        }));
        // messages.receiver_id → users.id
        await queryRunner.createForeignKey('messages', new TableForeignKey({
            name: 'FK_messages_receiver',
            columnNames: ['receiver_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }));
        // messages.room_id → rooms.id
        await queryRunner.createForeignKey('messages', new TableForeignKey({
            name: 'FK_messages_room',
            columnNames: ['room_id'],
            referencedTableName: 'rooms',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        // Prevent duplicate room membership
        await queryRunner.createUniqueConstraint('room_members', new TableUnique({
            name: 'UQ_room_members_user_room',
            columnNames: ['user_id', 'room_id'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('messages');
        await queryRunner.dropTable('room_members');
        await queryRunner.dropTable('rooms');
    }
}
//# sourceMappingURL=1790840563452-CreateChatTable.js.map
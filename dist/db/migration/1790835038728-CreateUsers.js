import { Table } from "typeorm";
export class CreateUsers1790835038728 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    generationStrategy: 'identity',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '100',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users');
    }
}
//# sourceMappingURL=1790835038728-CreateUsers.js.map
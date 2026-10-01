import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
if (!process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME) {
    throw new Error('Missing required database environment variables');
}
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/models/*.ts'],
    migrations: ['src/db/migration/*.ts'],
    synchronize: false,
});
export default AppDataSource;
//# sourceMappingURL=databaseConnection.js.map
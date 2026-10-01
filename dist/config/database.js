import { Sequelize } from 'sequelize';
if (!process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME) {
    throw new Error('Missing required database environment variables');
}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
});
export default sequelize;
//# sourceMappingURL=database.js.map
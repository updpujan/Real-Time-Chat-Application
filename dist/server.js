import 'dotenv/config';
import sequelize from './config/database.js';
import app from './app.js';
import './models/index.js';
import { initilizeWebSocket } from './websocket/webSocketServer.js';
import redis from './config/redis.js';
import logger from './config/logger.js';
import http from 'node:http';
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connected successfully');
        await redis.connect();
        logger.info('Redis connected sucessfully');
        const server = http.createServer(app);
        initilizeWebSocket(server);
        server.listen(PORT, () => {
            logger.info(`HTTP server running on port ${PORT}`);
        });
    }
    catch (error) {
        logger.error('Failed to start server', { error: error, });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map
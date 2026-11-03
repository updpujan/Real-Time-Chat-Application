import { Router } from 'express';
import sequelize from '../config/database.js';
import logger from '../config/logger.js';
const router = Router();
router.get('/health', async (_req, res) => {
    try {
        await sequelize.authenticate();
        logger.info('Health Check', { code: 200, status: 'healthy', server: 'up', database: 'up' });
        return res.status(200).json({
            status: 'healthy',
            server: 'up',
            database: 'up',
        });
    }
    catch {
        logger.info('Health Check', { code: 503, status: 'unhealthy', server: 'up', database: 'down' });
        return res.status(503).json({
            status: 'unhealthy',
            server: 'up',
            database: 'down',
        });
    }
});
export default router;
//# sourceMappingURL=healthRoute.js.map
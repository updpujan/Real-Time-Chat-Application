import { Router } from 'express';
import sequelize from '../config/database.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      status: 'healthy',
      server: 'up',
      database: 'up',
    });
  } catch {
    return res.status(503).json({
      status: 'unhealthy',
      server: 'up',
      database: 'down',
    });
  }
});

export default router;

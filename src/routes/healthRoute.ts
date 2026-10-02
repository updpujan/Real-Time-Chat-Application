import { Router } from 'express';
import sequelize from '../config/database.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check server and database health
 *     description: Checks whether the application server and PostgreSQL database are available.
 *     tags:
 *       - Health
 *
 *     responses:
 *       '200':
 *         description: Server and database are healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 server:
 *                    type: string
 *                    example: up
 *                 database:
 *                    type: string
 *                    example: up
 *
 *       '503':
 *         description: services unavailable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unhealthy
 *                 server:
 *                   type: string
 *                   example: up
 *                 database:
 *                   type: string
 *                   example: down
 */
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

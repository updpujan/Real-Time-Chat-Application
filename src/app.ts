import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import sessionMiddleware from './config/session.js';

import healthcheck from './routes/healthRoute.js';
import authRoute from './routes/authRoutes.js';
import chatRoute from './routes/chatRoute.js';

import { requireAuth } from './middleware/requireMiddleware.js';
import errorHandler from './middleware/errorHander.js';

const app = express();
const frontendPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger - api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Session middleware
app.use(sessionMiddleware);

// Unprotected routes
app.use('/', healthcheck);
// Auth routes //
app.use('/auth', authRoute);

//protected routes
app.use('/chat', requireAuth, chatRoute);

// Frontend
app.use(express.static(frontendPath));

// Error handler
app.use(errorHandler);

export default app;

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import sessionMiddleware from './config/session.js';

import healthcheck from './routes/healthRoute.js';
import authRoute from './routes/authRoutes.js';

import errorHandler from './middleware/errorHander.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//unprotected routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', healthcheck);
app.use('/auth', authRoute);

//frontend
app.set('view engine', 'ejs');
app.set('views', './src/views');

//protected routes
app.use(sessionMiddleware);

//error handler
app.use(errorHandler);

export default app;

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
// Swagger - api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Session middleware
app.use(sessionMiddleware);
// Unprotected routes
app.use('/', healthcheck);
// Auth routes //
app.use('/auth', authRoute);
//protected routes
// Frontend
app.set('view engine', 'ejs');
app.set('views', './src/views');
// Error handler
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map
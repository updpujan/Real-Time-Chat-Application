import { AppError } from '../errors/errorType.js';
import logger from '../config/logger.js';
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        logger.error(err.message, { status: err.status, error: err.error });
        return res.status(err.status).json({
            message: err.message,
            error: err.error,
        });
    }
    //unhandled error
    logger.error('Service Unvaliable', { status: 503, error: String(err) });
    return res.status(503).json({
        message: 'Service unavailable',
        error: String(err),
    });
};
export default errorHandler;
//# sourceMappingURL=errorHander.js.map
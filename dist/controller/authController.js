import register from '../service/auth/registration.js';
import login from '../service/auth/login.js';
import { AppError } from '../errors/errorType.js';
export const registerController = async (req, res, _next) => {
    try {
        const response = await register(req.body);
        return res.status(response.status).json({
            message: response.message,
        });
    }
    catch (err) {
        return _next(err);
    }
};
export const loginController = async (req, res, _next) => {
    try {
        const response = await login(req.body.email, req.body.password);
        const id = response.data?.dataValues.id;
        req.session.userId = Number(id);
        return res.status(response.status).json({
            message: response.message,
        });
    }
    catch (err) {
        return _next(err);
    }
};
export const logoutController = async (req, res, _next) => {
    try {
        if (!req.session.userId) {
            throw new AppError({ status: 401, message: 'User not Authenticated' });
        }
        req.session.destroy((error) => {
            if (error) {
                throw new AppError({ status: 503, message: 'Failed to destroy session', error });
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({
                message: 'Logout sucessfully',
            });
        });
    }
    catch (err) {
        return _next(err);
    }
};
//# sourceMappingURL=authController.js.map
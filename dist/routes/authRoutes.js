import express from 'express';
import { registerValidate, emailValidate, loginValidate } from '../middleware/validate.js';
import { registerController, loginController, logoutController, } from '../controller/authController.js';
const route = express.Router();
route.post('/register', registerValidate, emailValidate, registerController);
route.post('/login', loginValidate, loginController);
route.post('/logout', logoutController);
export default route;
//# sourceMappingURL=authRoutes.js.map
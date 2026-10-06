import express from 'express';
import { registerValidate, emailValidate, loginValidate } from '../middleware/validate.js';
import { registerController, loginController } from '../controller/authController.js';

const route = express.Router();

route.post('/register', registerValidate, emailValidate, registerController);

route.post('/login', loginValidate, loginController);

export default route;

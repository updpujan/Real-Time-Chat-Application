import express from 'express';
import { registerValidate, emailValidate } from '../middleware/validate.js';
import { registerController } from '../controller/authController.js';

const route = express.Router();

route.post('/register', registerValidate, emailValidate, registerController);

//route.post('/login',);

export default route;

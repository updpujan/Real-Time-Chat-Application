import { getUserByEmail } from '../../repository/auth/getUser.js';
import { SuccessResponse } from '../../types/response.js';
import brcypt from 'bcrypt';
import { AppError } from '../../errors/errorType.js';
import User from '../../models/users.js';

const loginService = async (email: string, password: string) => {
  const userData = await getUserByEmail(email);

  if (!userData) throw new AppError({ status: 401, message: 'Invalid login credentails' });

  const checkpassword = await brcypt.compare(password, userData.password);

  if (!checkpassword) throw new AppError({ status: 401, message: 'Invalid login credentails' });

  const sucess: SuccessResponse<User> = {
    status: 200,
    message: 'login sucessfully',
    data: userData,
  };
  return sucess;
};

export default loginService;

import { getUserByEmail } from '../../repository/auth/getUser.js';
import { ErrorResponse, SuccessResponse } from '../../types/response.js';
import brcypt from 'bcrypt';
import { AppError } from '../../errors/errorType.js';
import User from '../../models/users.js';

const loginService = async (email: string, password: string) => {
  const error: ErrorResponse = {
    status: 401,
    message: 'Invalid login credentails',
  };
  const userData = await getUserByEmail(email);

  if (!userData) throw new AppError(error);

  const checkpassword = await brcypt.compare(password, userData.password);

  if (!checkpassword) throw new AppError(error);

  const sucess: SuccessResponse<User> = {
    status: 200,
    message: 'login sucessfully',
    data: userData,
  };
  return sucess;
};

export default loginService;

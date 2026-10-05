import User from '../../models/users.js';
import { RegisterInput } from '../../schema/auth/registration.js';
import { SuccessResponse } from '../../types/response.js';

const postUser = async (user: RegisterInput) => {
  await User.create(user);
  const sucess: SuccessResponse = {
    status: 201,
    message: 'user registered sucessfully',
  };
  return sucess;
};
export default postUser;

import bcrypt from 'bcrypt';
import { RegisterInput } from '../../schema/auth/registration.js';
import postUser from '../../repository/auth/postUser.js';

const register = async (user: RegisterInput) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return await postUser(user);
};

export default register;

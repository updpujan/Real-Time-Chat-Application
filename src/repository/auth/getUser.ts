import User from '../../models/users.js';

export const getUserByEmail = async (email: string) => {
  const result = await User.findOne({
    where: {
      email: email,
    },
  });
  return result;
};

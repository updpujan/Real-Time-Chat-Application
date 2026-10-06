import User from '../../models/users.js';
const postUser = async (user) => {
    await User.create(user);
    const sucess = {
        status: 201,
        message: 'user registered sucessfully',
    };
    return sucess;
};
export default postUser;
//# sourceMappingURL=postUser.js.map
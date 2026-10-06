import User from '../../models/users.js';
export const getUserByEmail = async (email) => {
    const result = await User.findOne({
        where: {
            email: email,
        },
    });
    return result;
};
//# sourceMappingURL=getUser.js.map
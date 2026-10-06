import bcrypt from 'bcrypt';
import postUser from '../../repository/auth/postUser.js';
const register = async (user) => {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return await postUser(user);
};
export default register;
//# sourceMappingURL=registration.js.map
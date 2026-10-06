import { getUserByEmail } from '../../repository/auth/getUser.js';
import brcypt from 'bcrypt';
import { AppError } from '../../errors/errorType.js';
const loginService = async (email, password) => {
    const userData = await getUserByEmail(email);
    if (!userData)
        throw new AppError({ status: 401, message: 'Invalid login credentails' });
    const checkpassword = await brcypt.compare(password, userData.password);
    if (!checkpassword)
        throw new AppError({ status: 401, message: 'Invalid login credentails' });
    const sucess = {
        status: 200,
        message: 'login sucessfully',
        data: userData,
    };
    return sucess;
};
export default loginService;
//# sourceMappingURL=login.js.map
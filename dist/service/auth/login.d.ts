import { SuccessResponse } from '../../types/response.js';
import User from '../../models/users.js';
declare const loginService: (email: string, password: string) => Promise<SuccessResponse<User>>;
export default loginService;
//# sourceMappingURL=login.d.ts.map
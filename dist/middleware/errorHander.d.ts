import { NextFunction, Request, Response } from 'express';
declare const errorHandler: (err: unknown, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandler;
//# sourceMappingURL=errorHander.d.ts.map
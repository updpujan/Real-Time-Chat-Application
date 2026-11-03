import type { Request, Response, NextFunction } from 'express';
export declare const getchatHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteChatMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=chatcontrollert.d.ts.map
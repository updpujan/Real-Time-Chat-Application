import { ErrorResponse } from '../types/response.js';
export declare class AppError extends Error {
    status: number;
    error?: unknown;
    constructor(response: ErrorResponse);
}
//# sourceMappingURL=errorType.d.ts.map
export interface SuccessResponse<T = unknown> {
    status: number;
    message: string;
    data?: T;
}
export interface ErrorResponse {
    status: number;
    message: string;
    error?: unknown;
}
//# sourceMappingURL=response.d.ts.map
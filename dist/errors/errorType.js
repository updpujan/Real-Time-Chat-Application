export class AppError extends Error {
    status;
    error;
    constructor(response) {
        super(response.message);
        this.name = 'AppError';
        this.status = response.status;
        this.error = response.error;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=errorType.js.map
import { ErrorResponse } from '../types/response.js';

export class AppError extends Error {
  status: number;
  error?: unknown;

  constructor(response: ErrorResponse) {
    super(response.message);

    this.name = 'AppError';
    this.status = response.status;
    this.error = response.error;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

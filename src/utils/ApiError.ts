// utils/ApiError.ts
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace for where our error was thrown (V8)
    Error.captureStackTrace(this, this.constructor);
  }
}
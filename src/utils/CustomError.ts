/**
 * Custom error class for application-specific errors
 * @class CustomError
 * @extends {Error}
 */
export class CustomError extends Error {
  statusCode: number;
  multipleErrors: boolean;

  constructor(message: string, statusCode: number = 500, multipleErrors: boolean = false) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.multipleErrors = multipleErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}


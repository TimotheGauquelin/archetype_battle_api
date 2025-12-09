/**
 * Custom error class for application-specific errors
 * @class CustomError
 * @extends {Error}
 */
export class CustomError extends Error {
    constructor(message, statusCode = 500, multipleErrors = false) {
        super(message);
        this.name = 'CustomError';
        this.statusCode = statusCode;
        this.multipleErrors = multipleErrors;
        Error.captureStackTrace(this, this.constructor);
    }
}


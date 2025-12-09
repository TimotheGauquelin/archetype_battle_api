import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof CustomError) {
        const errStatus = err.statusCode || 500;
        const errMessage = err.message || 'Une erreur inconnue s\'est produite';
        const haveMultipleErrors = err.multipleErrors || false;

        if (haveMultipleErrors) {
            res.status(errStatus).json({
                message: errMessage,
                status: errStatus,
                multipleErrors: true
            });
        } else {
            res.status(errStatus).json({
                message: errMessage,
                status: errStatus,
            });
        }
    } else {
        console.error('Unexpected error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
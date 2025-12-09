import { CustomError } from "../utils/CustomError";
import { NextFunction } from "express";

import type { Request, Response } from "express";

export const passwordHandler = (req: Request, res: Response, next: NextFunction) => {
    const password = (req.body && typeof req.body === "object" && 'password' in req.body)
        ? (req.body as any).password
        : undefined;

    const errors: string[] = [];

    if (!password) {
        throw new CustomError('Un mot de passe est requis.', 400);
    }

    if (password.length < 8) {
        errors.push('Au moins 8 caractères.');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Une lettre majuscule.');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Une lettre minuscule.');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Un chiffre.');
    }

    if (!/[@$!%*?&^#_+\-=\[\]{}|\\:;,.<>~]/.test(password)) {
        errors.push('Un caractère spécial parmi : @ $ ! % * ? & ^ # _ + - = [ ] { } | \\ : ; , . < > ~.');
    }

    if (errors.length > 0) {
        const errorMessage = `Le mot de passe doit répondre aux critères suivants :\n- ${errors.join('\n- ')}`;
        throw new CustomError(errorMessage, 400, true);
    }

    next();
};

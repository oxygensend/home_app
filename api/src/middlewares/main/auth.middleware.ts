import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { Authenticator } from '../../crypto/auth/authenticator';
import { HttpExceptions } from '../../exceptions';
import Unauthorized = HttpExceptions.Unauthorized;
import { MiddlewareInterface } from './middleware.interface';

@Service()
export class AuthMiddleware implements MiddlewareInterface {
    constructor(private readonly authenticator: Authenticator) {}

    call(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['authorization'] as string | null;
        if (!token || !token.startsWith('Bearer')) {
            return next(new Unauthorized('Access denied.'));
        }

        req.user = this.authenticator.getLoggedUser(token.replace('Bearer ', ''));

        return next();
    }
}

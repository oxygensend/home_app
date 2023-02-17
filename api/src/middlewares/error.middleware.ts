import { NextFunction, Request, Response } from 'express';
import { HttpException, HttpExceptions } from '../exceptions/exceptions';
import BadRequestException = HttpExceptions.BadRequest;
import { Service } from 'typedi';
import { MiddlewareInterface } from './middleware.interface';

interface IError {
    error: string;
    stack?: string;
}

@Service()
export class ErrorMiddleware implements MiddlewareInterface<Error> {
    call(err: Error, req: Request, res: Response, next: NextFunction): void {
        if (err instanceof HttpException) {
            const message: string | object =
                err instanceof BadRequestException
                    ? { violations: JSON.parse(err.message) }
                    : err.message;
            res.status(err.statusCode()).json({ error: message });
        } else {
            const error: IError = { error: err.message };
            if (process.env.NODE_ENV !== 'production') {
                error['stack'] = err.stack;
            }
            res.status(500).json(error);
        }
    }
}

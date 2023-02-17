import { NextFunction, Request, Response } from 'express';

type ExpressMiddleware<T> = T extends Error
    ? (err: Error, req: Request, res: Response, next: NextFunction) => any
    : (req: Request, res: Response, next: NextFunction) => any;

export interface MiddlewareInterface<T = void> {
    call: ExpressMiddleware<T>;
}

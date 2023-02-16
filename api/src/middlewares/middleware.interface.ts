import {NextFunction, Request, Response} from "express";

export interface MiddlewareInterface {
    call(req: Request, res: Response, next: NextFunction): void
}
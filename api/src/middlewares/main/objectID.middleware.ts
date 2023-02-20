import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { MiddlewareInterface } from './middleware.interface';
import { Service } from 'typedi';
import { HttpExceptions } from '../../exceptions';

@Service()
export class ObjectIDMiddleware implements MiddlewareInterface {
    call(req: Request, res: Response, next: NextFunction) {
        if (!Types.ObjectId.isValid(req.params.id)) {
            throw new HttpExceptions.NotFound(`Invalid ID ${req.params.id}`);
        }
        return next();
    }
}

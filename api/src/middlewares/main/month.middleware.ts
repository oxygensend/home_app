import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { HttpExceptions } from '../../exceptions';

@Service()
export class MonthMiddleware implements MiddlewareInterface {
    async call(req: Request, res: Response, next: NextFunction): Promise<any> {
        const month = req.params.month;

        if (!month.match(/\d{4}-\d{2}/) || isNaN(Date.parse(month))) {
            throw new HttpExceptions.NotFound('Invalid date provided. Provide allowed format YYYY-mm');
        }

        return next();
    }
}

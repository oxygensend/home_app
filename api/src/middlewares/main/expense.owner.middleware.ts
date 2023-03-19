import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { Expense } from '../../models/expense.model';
import { HttpExceptions } from '../../exceptions';
import { Service } from 'typedi';

@Service()
export class ExpenseOwnerMiddleware implements MiddlewareInterface {
    async call(req: Request, res: Response, next: NextFunction): Promise<any> {
        const expense = await Expense.findById(req.params.id);

        if (expense?.executor.username !== req.user.username) {
            throw new HttpExceptions.AccessDenied('Only owner can edit expense');
        }

        return next();
    }
}

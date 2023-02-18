import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Logger } from '../lib/logger';
import winston from 'winston';
import { Controller, Patch, Post } from '../decorators/routing';
import { ExpenseService } from '../services/expense.service';
import { HTTP_CODES } from '../config/http.codes';
import { ExpenseOwnerMiddleware } from '../middlewares/expense.owner.middleware';

@Service()
@Controller('/expenses')
export default class ExpensesController {
    private readonly logger: winston.Logger;

    constructor(private readonly expenseService: ExpenseService) {
        this.logger = Logger.getLogger();
    }

    @Post('', [AuthMiddleware])
    public async create(req: Request, res: Response) {
        const response = await this.expenseService.createExpense(req);
        return res.status(HTTP_CODES.CREATED).json(response);
    }

    @Patch('/:id', [AuthMiddleware, ExpenseOwnerMiddleware])
    public async edit(req: Request, res: Response) {
        const response = await this.expenseService.editExpense(req);
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }
}

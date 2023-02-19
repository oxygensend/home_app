import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Logger } from '../lib/logger';
import winston from 'winston';
import { Controller, Delete, Get, Patch, Post } from '../decorators/routing';
import { ExpenseService } from '../services/expense.service';
import { HTTP_CODES } from '../config/http.codes';
import { ExpenseOwnerMiddleware } from '../middlewares/expense.owner.middleware';
import { ObjectIDMiddleware } from '../middlewares/objectID.middleware';
import { MonthMiddleware } from '../middlewares/month.middleware';

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

    @Patch('/:id', [AuthMiddleware, ObjectIDMiddleware, ExpenseOwnerMiddleware])
    public async edit(req: Request, res: Response) {
        const response = await this.expenseService.editExpense(req);
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }

    @Delete('/:id', [
        AuthMiddleware,
        ObjectIDMiddleware,
        ExpenseOwnerMiddleware,
    ])
    public async delete(req: Request, res: Response) {
        await this.expenseService.deleteExpense(req);
        return res.status(HTTP_CODES.NO_CONTENT).json({});
    }

    @Get('/excerpts/:month', [AuthMiddleware, MonthMiddleware])
    public async getExcerptsByMonth(req: Request, res: Response) {
        const response = await this.expenseService.getByMonth(req.params.month);
        return res.status(HTTP_CODES.SUCCESS).json({});
    }

    @Get('/:id', [AuthMiddleware, ObjectIDMiddleware])
    public async getOne(req: Request, res: Response) {
        const response = await this.expenseService.getExpense(req);
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }
}

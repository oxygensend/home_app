import { Service } from 'typedi';
import { Request, Response } from 'express';
import { Logger } from '../lib/logger';
import winston from 'winston';
import { Controller, Delete, Get, Patch, Post } from '../decorators/routing';
import { ExpenseService } from '../services';
import { HTTP_CODES } from '../config/http.codes';
import {
    AuthMiddleware,
    ExpenseOwnerMiddleware,
    MonthMiddleware,
    ObjectIDMiddleware,
} from '../middlewares';

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
        const response = await this.expenseService.getByMonth(
            req.params.month,
            req.query
        );
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }

    @Get('/:id', [AuthMiddleware, ObjectIDMiddleware])
    public async getOne(req: Request, res: Response) {
        const response = await this.expenseService.getExpense(req);
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }
}

import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { DtoFactory } from '../factories/dto.factory';
import { ExpenseDto } from '../dto/expense.dto';
import { Logger } from '../lib/logger';
import winston from 'winston';
import { Controller, Post } from '../decorators/routing';
import { ExpenseService } from '../services/expense.service';
import { HTTP_CODES } from '../config/http.codes';

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
        return res.json(response).status(HTTP_CODES.SUCCESS);
    }
}

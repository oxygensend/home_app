import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { DtoFactory } from '../factories/dto.factory';
import { ExpenseDto } from '../dto/expense.dto';
import { Logger } from '../lib/logger';
import winston from 'winston';
import {Controller, Post} from "../decorators/routing";

@Service()
@Controller('/expenses')
export default class ExpensesController {
    private readonly logger: winston.Logger;

    constructor() {
        this.logger = Logger.getLogger();
    }

    @Post('', [AuthMiddleware])
    public async create(req: Request, res: Response) {
        const dto = await DtoFactory.create<ExpenseDto>(
            ExpenseDto,
            req.body as Partial<ExpenseDto>
        );

        this.logger.info(dto);
    }
}

import { ExpenseDto } from '../dto/expense.dto';
import {Expense, ExpenseInterface} from '../models/expense.model';
import winston from 'winston';
import { Logger } from '../lib/logger';
import { Shop } from '../models/shop.model';
import { Request } from 'express';
import { DtoFactory } from '../factories/dto.factory';
import {Service} from "typedi";

@Service()
export class ExpenseService {
    private logger: winston.Logger;

    constructor() {
        this.logger = Logger.getLogger();
    }

    public async createExpense(req: Request): Promise<ExpenseInterface> {

        const dto = await DtoFactory.create<ExpenseDto>(
            ExpenseDto,
            req.body as Partial<ExpenseDto>
        );
        const expense = await Expense.create(dto);

        // add shop to database if doesnt exists
        if (dto.shop) {
            const existingShop = await Shop.findOne({ name: dto.shop });
            if (!existingShop) {
                await Shop.create({ name: dto.shop });
            }
        }

        this.logger.info(`User ${req.user.username} created new expense ${expense}`);
        return expense;
    }
}

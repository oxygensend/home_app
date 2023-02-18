import { ExpensePostDto } from '../dto/expense.post.dto';
import { Expense, ExpenseInterface } from '../models/expense.model';
import winston from 'winston';
import { Logger } from '../lib/logger';
import { Shop } from '../models/shop.model';
import { Request } from 'express';
import { DtoFactory } from '../factories/dto.factory';
import { Service } from 'typedi';
import { ExpensePatchDto } from '../dto/expense.patch.dto';
import { HttpExceptions } from '../exceptions/exceptions';

@Service()
export class ExpenseService {
    private logger: winston.Logger;

    constructor() {
        this.logger = Logger.getLogger();
    }

    public async createExpense(req: Request): Promise<ExpenseInterface> {
        const dto = await DtoFactory.create<ExpensePostDto>(
            ExpensePostDto,
            req.body as Partial<ExpensePostDto>
        );
        const expense = await Expense.create(dto);

        // add shop to database if it doesn't exist
        if (dto.shop) {
            await this.addShopToList(dto.shop);
        }

        this.logger.info(
            `User ${req.user.username} created new expense ${expense}`
        );
        return expense;
    }

    public async editExpense(req: Request): Promise<ExpenseInterface> {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            throw new HttpExceptions.NotFound('Expense not found');
        }

        const oldExpense = { ...expense.toObject() };
        const dto = await DtoFactory.create<ExpensePatchDto>(
            ExpensePatchDto,
            req.body as Partial<ExpensePatchDto>
        );
        expense.set(dto);
        await expense.save();

        // add shop to database if it doesn't exist
        if (dto.shop) {
            await this.addShopToList(dto.shop);
        }

        this.logger.info(
            `User ${req.user.username} edited expense from  ${JSON.stringify(
                oldExpense
            )} to ${JSON.stringify(expense)}`
        );
        return expense;
    }

    private async addShopToList(shop: string): Promise<void> {
        const existingShop = await Shop.findOne({ name: shop });
        if (!existingShop) {
            await Shop.create({ name: shop });
        }
    }
}

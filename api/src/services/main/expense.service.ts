import { Expense, ExpenseInterface } from '../../models/expense.model';
import winston from 'winston';
import { Logger } from '../../lib/logger';
import { Shop } from '../../models/shop.model';
import { Request } from 'express';
import { DtoFactory } from '../../factories';
import { Service } from 'typedi';
import { HttpExceptions } from '../../exceptions';
import { ExpenseHelper } from '../../helpers';
import { ExpensePatchDto, ExpensePostDto, RelatedUserDto } from '../../dto';

@Service()
export class ExpenseService {
    private logger: winston.Logger;

    constructor(private readonly expenseHelper: ExpenseHelper) {
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
        const expense = await this.expenseHelper.findOneOrThrowException(
            req.params.id
        );
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

    public async getExpense(req: Request): Promise<ExpenseInterface> {
        const expense = await this.expenseHelper.findOneOrThrowException(
            req.params.id
        );
        const ifParticipant =
            expense.participants.filter(
                (el: RelatedUserDto) => el.username === req.user.username
            ).length > 0;

        if (!ifParticipant) {
            throw new HttpExceptions.AccessDenied(
                'Only participant has access to expense details'
            );
        }

        return expense;
    }

    public async deleteExpense(req: Request): Promise<void> {
        const expense = await this.expenseHelper.findOneOrThrowException(
            req.params.id
        );
        await expense.remove();
    }

    public async getByMonth(month: string, filters: any): Promise<any> {
        const balance = await this.expenseHelper.getMonthlyBalance(
            month,
            filters
        );
        const expenses = await this.expenseHelper.getExpensesByMonth(
            month,
            filters
        );
        return {
            expenses: expenses,
            balance: balance,
            total: expenses.length,
        };
    }

    private async addShopToList(shop: string): Promise<void> {
        const existingShop = await Shop.findOne({ name: shop });
        if (!existingShop) {
            await Shop.create({ name: shop });
        }
    }
}

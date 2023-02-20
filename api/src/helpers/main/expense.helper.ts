import { Expense } from '../../models/expense.model';
import { Service } from 'typedi';
import { HttpExceptions } from '../../exceptions';
import {ExpenseFilterInterface, ExpenseSortEnum} from "../../filters";

@Service()
export class ExpenseHelper {
    public getExpensesByMonth(
        month: string,
        filters: ExpenseFilterInterface
    ): any {
        const query = Expense.find({
            $expr: {
                $eq: [
                    {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$transactionDate',
                        },
                    },
                    month,
                ],
            },
        }).select({
            _id: 1,
            amount: 1,
            executor: 1,
            participants: 1,
            transactionDate: 1,
        });

        if (filters.executor) {
            query.where('executor.username').equals(filters.executor);
        }

        if (filters.participants) {
            const participantsIds = filters.participants.split(',');
            query.where('participants.username').in(participantsIds);
        }

        if (filters.shop) {
            query.where('shop').equals(filters.shop);
        }

        if (filters.name) {
            query.where('name').equals(filters.name);
        }

        if (filters.sort) {
            switch (filters.sort) {
                case ExpenseSortEnum.TRANSACTION:
                    query.sort({ transactionDate: 1 });
                    break;
                case ExpenseSortEnum.NEWEST:
                    query.sort({ createdAt: -1 });
                    break;
                case ExpenseSortEnum.AMOUNT_DESC:
                    query.sort({ amount: -1 });
                    break;
                case ExpenseSortEnum.AMOUNT_ASC:
                    query.sort({ amount: 1 });
                    break;
                default:
                    query.sort({ transactionDate: 1 });
            }
        } else {
            query.sort({ transactionDate: 1 });
        }

        return query.exec();
    }

    public getMonthlyBalance(month: string, filters: ExpenseFilterInterface) {
        const matchStages = [];

        matchStages.push({
            $match: {
                $expr: {
                    $eq: [
                        {
                            $dateToString: {
                                format: '%Y-%m',
                                date: '$transactionDate',
                            },
                        },
                        month,
                    ],
                },
            },
        });

        if (filters.executor) {
            matchStages.push({
                $match: {
                    'executor.id': filters.executor,
                },
            });
        }

        if (filters.shop) {
            matchStages.push({
                $match: {
                    shop: filters.shop,
                },
            });
        }

        if (filters.name) {
            matchStages.push({
                $match: {
                    name: filters.name,
                },
            });
        }

        const query = Expense.aggregate([
            ...matchStages,
            {
                $group: {
                    _id: '$executor.username',
                    totalAmount: { $sum: '$amount' },
                    expensesCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    executor: '$_id',
                    totalAmount: 1,
                    expensesCount: 1,
                },
            },
        ]);

        return query.exec();
    }

    public async findOneOrThrowException(id: string): Promise<any> {
        const expense = await Expense.findById(id);
        if (!expense) {
            throw new HttpExceptions.NotFound('Expense not found');
        }

        return expense;
    }
}

import { ExcerptExpense, Expense } from '../types';

export const mapExpenseToExpenseExcerpt = (expense: Expense): ExcerptExpense => {
    return {
        _id: expense._id,
        shop: expense.shop,
        amount: expense.amount,
        executor: expense.executor,
        participants: expense.participants,
        transactionDate: expense.transactionDate,
    };
};

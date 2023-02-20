import { ExpenseSortEnum } from './expense.sort.enum';

export interface ExpenseFilterInterface {
    executor?: string;
    sort?: ExpenseSortEnum;
    participants : string;
    shop?: string;
    name?: string;
}

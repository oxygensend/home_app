import { ExpensesElement } from './expensesElement';
import { ExcerptExpense } from '../../types';

type ExpensesListProps = {
    expenses: ExcerptExpense[];
};
export const ExpensesList = ({ expenses }: ExpensesListProps) => {
    return (
        <div
            className={
                'bg-pink-300 mt-10 h-2/3  w-96 md:w-128 xl:w-140 rounded-lg flex flex-col divide-y divide-gray-500 overflow-auto no-scrollbar'
            }
        >
            {expenses.map((expense, i) => {
                return <ExpensesElement expense={expense} key={i} />;
            })}
        </div>
    );
};

import { ExcerptExpense } from '../../../types';

type ExpensesElementProps = {
    expense: ExcerptExpense;
};
export const ExpensesElement = ({ expense }: ExpensesElementProps) => {
    return (
        <div
            className={
                'flex flex-row justify-between items-center p-4  hover:bg-pink-600 cursor-pointer'
            }
        >
            <p className={'text-2xl italic'}>{expense.amount + ' zł'}</p>
            <p className={'italic'}>{expense.shop}</p>
            <div className={'mr-5'}>
                {expense.participants.map((user, i) => {
                    return (
                        <p
                            className={
                                user.username === expense.executor.username
                                    ? 'font-bold text-pink-800'
                                    : ''
                            }
                            key={i}
                        >
                            {user.username}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

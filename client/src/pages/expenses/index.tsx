import {Layout} from '../../components/layout';
import {ReactComponent as ArrowRight} from '../../assets/images/arrow-right-solid.svg';
import {ReactComponent as ArrowLeft} from '../../assets/images/arrow-left-solid.svg';
import {useEffect, useState} from 'react';
import authAxios from '../../services/authAxios';
import {BalanceType, ExcerptExpense, ExpenseResponse} from '../../types';
import {ExpensesList} from '../../components/expensesList';
import {BalanceTable} from '../../components/balanceTable';
import moment from 'moment';
import {Modal} from '../../components/modal';
import {ExpenseForm} from "../../components/expenseForm";
import {setFlashMessage} from "../../utils/setFlashMessage";

type ExpenseExcerptsResponse = {
    total: number;
    expenses: ExcerptExpense[];
    balance: BalanceType[];
};

export const Expenses = ({}) => {
    const [expenses, setExpenses] = useState<ExcerptExpense[]>([]);
    const [balance, setBalance] = useState<BalanceType[]>();
    const [total, setTotal] = useState<number>(0);
    const [month, setMonth] = useState(moment());
    const [isExpenseFormModalOpen, setIsExpenseFormModalOpen] =
        useState<boolean>(false);

    useEffect(() => {
        authAxios
            .get<ExpenseExcerptsResponse>(
                '/api/expenses/excerpts/' + month.format('YYYY-MM')
            )
            .then((res) => {
                setExpenses(res.data.expenses);
                setBalance(res.data.balance);
                setTotal(res.data.total);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [month]);

    const addMonth = (nb: number) => {
        const previousMonth = month.clone().add(nb, 'month');
        setMonth(previousMonth);
    };

    const addNewExpenseToList = (data: ExpenseResponse) => {
        expenses.push({
            _id: data._id,
            shop: data.shop,
            amount: data.amount,
            executor: data.executor,
            participants: data.participants,
            transactionDate: data.transactionDate
        });
        setIsExpenseFormModalOpen(false);
        setFlashMessage('New expenses added successfully.');

    }

    return (
        <Layout>
            <div className={'h-full flex flex-col items-center mt-10'}>
                <div className={'flex flex-row gap-5 items-center'}>
                    <ArrowLeft
                        fill={'white'}
                        width={20}
                        height={20}
                        className={'cursor-pointer'}
                        onClick={() => addMonth(-1)}
                    />
                    <p className={'text-pink-50 text-3xl'}>
                        {month.format('MMMM YYYY')}
                    </p>
                    <ArrowRight
                        fill={'white'}
                        width={20}
                        height={20}
                        className={'cursor-pointer'}
                        onClick={() => addMonth(1)}
                    />
                </div>

                {expenses ? <ExpensesList expenses={expenses}/> : null}
                <div className={'w-96 md:w-128 xl:w-140 mt-10'}>
                    <p
                        className={
                            'text-pink-50 text-2xl md:text-3xl font-semibold  mb-2'
                        }
                    >
                        Balance
                    </p>

                    {balance ? (
                        <BalanceTable balance={balance} total={total}/>
                    ) : null}
                </div>
                <div
                    className={
                        'bg-pink-600 text-gray-50 rounded items-center h-16 text-xl flex justify-center w-64 mt-10 mb-5 cursor-pointer'
                    }
                    onClick={() => setIsExpenseFormModalOpen(true)}
                >
                    Add new expense
                </div>

                <Modal
                    title={'Add new expense'}
                    isOpen={isExpenseFormModalOpen}
                    onClose={() => setIsExpenseFormModalOpen(false)}
                >
                    <ExpenseForm afterSubmit={addNewExpenseToList}/>
                </Modal>
            </div>
        </Layout>
    );
};

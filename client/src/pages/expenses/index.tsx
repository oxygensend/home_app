import { Layout } from '../../components/layout';
import { ReactComponent as ArrowRight } from '../../assets/images/arrow-right-solid.svg';
import { ReactComponent as ArrowLeft } from '../../assets/images/arrow-left-solid.svg';
import { useEffect, useState } from 'react';
import authAxios from '../../services/authAxios';
import { BalanceType, ExcerptExpense, Expense, ModalEnum } from '../../types';
import { ExpensesList } from '../../components/expensesList';
import { BalanceTable } from '../../components/balanceTable';
import moment from 'moment';
import { Modal } from '../../components/modal';
import { ExpenseForm } from '../../components/expenseForm';
import { setFlashMessage } from '../../utils/setFlashMessage';
import { ExpenseCard } from '../../components/expenseCard';
import { ConfirmationModal } from '../../components/confirmationModal';
import { removeFromStateArray } from '../../utils/removeFromStateArray';
import { getObjectDifference } from '../../utils/getObjectDifference';
import { replaceElementsInObject } from '../../utils/replaceElementsInObject';
import { mapExpenseToExpenseExcerpt } from '../../utils/mapExpenseToExpenseExcerpt';
import { getPayload } from '../../services/tokenStorage';

type ExpenseExcerptsResponse = {
    total: number;
    expenses: ExcerptExpense[];
    balance: BalanceType[];
};

export const Expenses = ({}) => {
    const [expenses, setExpenses] = useState<ExcerptExpense[]>([]);
    const [selectedExpense, setSelectedExpense] = useState<Expense>();
    const [balance, setBalance] = useState<BalanceType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [month, setMonth] = useState(moment());
    const [isExpenseFormModalOpen, setIsExpenseFormModalOpen] = useState<boolean>(false);
    const [isExpenseShowModalOpen, setIsExpenseShowModalOpen] = useState<boolean>(false);
    const [isExpenseDeleteModalOpen, setIsExpenseDeleteModalOpen] = useState<boolean>(false);
    const [isExpenseEditModalOpen, setIsExpenseEditModalOpen] = useState<boolean>(false);

    const { _id } = selectedExpense ?? {};
    const user = getPayload();

    useEffect(() => {
        authAxios
            .get<ExpenseExcerptsResponse>(
                '/api/expenses/excerpts/' + month.format('YYYY-MM') + '?participants=' + user.username,
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

    const addNewExpenseRequest = async (body: any) => {
        const { data } = await authAxios.post<Expense>('/api/expenses', body);

        const expense = mapExpenseToExpenseExcerpt(data);
        expenses.push(expense);

        // update balance
        for (const b of balance) {
            if (b.executor === expense.executor.username) {
                b.expensesCount++;
                b.totalAmount += expense.amount;
            }
        }

        setIsExpenseFormModalOpen(false);
        setFlashMessage('New expenses added successfully.');
    };

    const editExpenseRequest = async (body: Expense) => {
        if (!selectedExpense) return;

        const changedData = getObjectDifference(selectedExpense, body);

        if (Object.keys(changedData).length) {
            const { data } = await authAxios.patch<Expense>('/api/expenses/' + _id, changedData);
        }

        const updated = replaceElementsInObject<Expense>(selectedExpense, changedData);
        const index = expenses.findIndex((expense) => expense._id === _id);
        expenses.splice(index, 1, mapExpenseToExpenseExcerpt(updated));
        setSelectedExpense(updated);
        setIsExpenseEditModalOpen(false);
        setFlashMessage('Expense has been edited.');
    };

    const onExpenseClickHandler = async (_id: string) => {
        setIsExpenseShowModalOpen(true);
        try {
            const { data } = await authAxios.get<Expense>('/api/expenses/' + _id);
            setSelectedExpense(data);
        } catch (err: any) {
            console.log(err);
        }
    };

    const onExpenseDeleteClickHandler = async () => {
        try {
            await authAxios.delete('/api/expenses/' + _id);
            setSelectedExpense(undefined);
            setIsExpenseDeleteModalOpen(false);
            setExpenses(removeFromStateArray(expenses, _id, '_id'));
        } catch (err: any) {
            console.log(err);
        }
    };

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
                    <p className={'text-pink-50 text-3xl'}>{month.format('MMMM YYYY')}</p>
                    <ArrowRight
                        fill={'white'}
                        width={20}
                        height={20}
                        className={'cursor-pointer'}
                        onClick={() => addMonth(1)}
                    />
                </div>

                {expenses ? <ExpensesList expenses={expenses} onExpenseClickHandler={onExpenseClickHandler} /> : null}
                <div className={'w-96 md:w-128 xl:w-140 mt-10'}>
                    <p className={'text-pink-50 text-2xl md:text-3xl font-semibold  mb-2'}>Balance</p>

                    {balance ? <BalanceTable balance={balance} total={total} /> : null}
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
                    type={ModalEnum.COMMON}
                >
                    <ExpenseForm request={addNewExpenseRequest} />
                </Modal>

                {selectedExpense && (
                    <Modal
                        title={'Edit expense'}
                        isOpen={isExpenseEditModalOpen}
                        onClose={() => setIsExpenseEditModalOpen(false)}
                        type={ModalEnum.COMMON}
                        order={'50'}
                    >
                        <ExpenseForm request={editExpenseRequest} expense={selectedExpense} />
                    </Modal>
                )}

                {selectedExpense && (
                    <ExpenseCard
                        expense={selectedExpense}
                        isOpen={isExpenseShowModalOpen}
                        onClose={() => setIsExpenseShowModalOpen(false)}
                        showDeleteModal={() => setIsExpenseDeleteModalOpen(true)}
                        showEditModal={() => {
                            setIsExpenseEditModalOpen(true);
                        }}
                    />
                )}

                <ConfirmationModal
                    isOpen={isExpenseDeleteModalOpen}
                    onDecline={() => setIsExpenseDeleteModalOpen(false)}
                    onAgree={() => onExpenseDeleteClickHandler()}
                    content={'Are you sure of deleting this expense?'}
                />
            </div>
        </Layout>
    );
};

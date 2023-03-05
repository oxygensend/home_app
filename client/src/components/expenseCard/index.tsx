import moment from 'moment/moment';
import { Modal } from '../modal';
import { Expense, ModalEnum } from '../../types';
import { ExpenseProperty } from './expenseProperty';

type ExpenseModalProps = {
    expense: Expense;
    isOpen: boolean;
    onClose: () => void;
    showDeleteModal: () => void;
    showEditModal: () => void;
};

export const ExpenseCard = ({
    expense,
    isOpen,
    onClose,
    showDeleteModal,
    showEditModal,
}: ExpenseModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose()}
            title={'Expense'}
            type={ModalEnum.COMMON}
        >
            <div className={'pb-6 pl-6 pr-6 flex flex-col gap-3'}>
                <ExpenseProperty label={'Name'} value={expense?.name} />
                <ExpenseProperty label={'Shop'} value={expense?.shop} />
                <ExpenseProperty
                    label={'Amount'}
                    value={expense.amount + ' zł'}
                />
                <ExpenseProperty
                    label={'Executor'}
                    value={expense.executor.username}
                />
                <div className={'flex flex-row gap-2'}>
                    <p className={'text-pink-500 text-xl font-semibold'}>
                        Precipitants:
                    </p>
                    <div>
                        {expense.participants.map((user, i) => {
                            return (
                                <p className={'text-xl text-pink-50'} key={i}>
                                    {user.username}
                                </p>
                            );
                        })}
                    </div>
                </div>
                <ExpenseProperty
                    label={'Transaction date'}
                    value={moment(expense.transactionDate).format(
                        'DD MMMM YYYY'
                    )}
                />
                <ExpenseProperty
                    label={'Updated at'}
                    value={moment(expense.updatedAt).format('DD MMMM YYYY')}
                />

                <div className={'flex flex-row gap-4 mt-3 '}>
                    <div
                        className={
                            'bg-pink-50 hover:bg-pink-100 text-gray-800 hover:text-gray-500 text-sm rounded p-2 flex justify-center w-14 lg:w-20 cursor-pointer'
                        }
                        onClick={() => showEditModal()}
                    >
                        Edit
                    </div>

                    <div
                        className={
                            'bg-red-600 hover:bg-red-700 text-gray-50 text-sm rounded p-2  flex justify-center w-14 lg:w-20 cursor-pointer'
                        }
                        onClick={() => showDeleteModal()}
                    >
                        Delete
                    </div>
                </div>
            </div>
        </Modal>
    );
};

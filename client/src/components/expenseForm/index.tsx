import { Input } from '../input';
import { SubmitButton } from '../submitButton';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import authAxios from '../../services/authAxios';
import {
    ExcerptExpense,
    ExpenseResponse,
    ShopType,
    UserType,
} from '../../types';
import { Select } from '../select';
import { ShopSelect } from '../shopSelect';
import { getTodayIsoDate } from '../../utils/getTodayIsoDate';
import { findPropertyViolation } from '../../utils/findPropertyViolation';

type FormValues = {
    name: string;
    amount: string;
    executor: string;
    participants: Array<string>;
    shop: string;
    transactionDate: Date;
};

type ExpenseFormProps = {
    afterSubmit: (data: ExpenseResponse) => void;
};

export const ExpenseForm = ({ afterSubmit }: ExpenseFormProps) => {
    const { register, handleSubmit } = useForm<FormValues>();
    const [errors, setErrors] = useState([]);
    const [usersList, setUsersList] = useState<UserType[]>([]);
    const [shopList, setShopList] = useState<ShopType[]>([]);
    const shopDefaultSelectText = 'Choose shop';

    useEffect(() => {
        Promise.all([
            authAxios.get<UserType[]>('/api/users/list'),
            authAxios.get<ShopType[]>('/api/shops'),
        ]).then( ([users, shops]) => {
            setUsersList(users.data);
            setShopList(shops.data);
        });
    }, []);

    const onSubmit = async (body: FormValues) => {
        try {
            const executor = usersList.find(
                (user: UserType) => user.username === body.executor
            );
            const participants = usersList.filter((user: UserType) =>
                body.participants.includes(user.username)
            );

            const date = new Date(body.transactionDate).toISOString();
            const shop = body.shop === shopDefaultSelectText ? null : body.shop;

            const { data } = await authAxios.post<ExpenseResponse>(
                '/api/expenses',
                {
                    ...body,
                    executor: executor,
                    participants: participants,
                    transactionDate: date,
                    shop: shop,
                    amount: parseFloat(body.amount),
                }
            );

            afterSubmit(data);
        } catch (err: any) {
            console.log(err);
            if (err.response.status === 400) {
                setErrors(err.response.data.error.violations);
            } else {
                throw Error('Invalid exception occurred');
            }
        }
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={'flex flex-col gap-3 items-center mb-5'}
        >
            <Input
                name={'name'}
                label={'Name'}
                type={'text'}
                required={false}
                register={register}
                placeholder={'Expense name eg. Shopping 14.02'}
                width={' w-5/6'}
                error={findPropertyViolation<ExcerptExpense>(errors, 'name')}
            />

            <Input
                name={'amount'}
                label={'Amount *'}
                type={'number'}
                step={0.01}
                required={true}
                register={register}
                placeholder={'Add amount'}
                width={' w-5/6'}
                error={findPropertyViolation<ExcerptExpense>(errors, 'amount')}
            />

            <ShopSelect
                options={shopList}
                label={'Shop'}
                value={'name'}
                display={'name'}
                register={register}
                defaultOptionText={'Choose shop'}
            />

            <Select
                name={'executor'}
                options={usersList}
                label={'Executor *'}
                value={'username'}
                display={'username'}
                register={register}
                required={true}
                multiple={false}
                width={' w-5/6'}
                defaultOptionText={'Choose an executor'}
                error={findPropertyViolation<ExcerptExpense>(
                    errors,
                    'executor'
                )}
            />

            <Select
                name={'participants'}
                options={usersList}
                label={'Participants *'}
                value={'username'}
                display={'username'}
                register={register}
                required={true}
                multiple={true}
                width={' w-5/6'}
                error={findPropertyViolation<ExcerptExpense>(
                    errors,
                    'participants'
                )}
            />

            <Input
                name={'transactionDate'}
                label={'Date *'}
                type={'date'}
                required={true}
                register={register}
                placeholder={''}
                width={' w-5/6'}
                defaultValue={getTodayIsoDate()}
                error={findPropertyViolation<ExcerptExpense>(
                    errors,
                    'transactionDate'
                )}
            />

            <SubmitButton
                value={'Create'}
                className={
                    'bg-pink-600 text-gray-50 rounded py-1 w-1/2 lg:w-64 h-10 hover:bg-pink-400 hover:text-pink-600 mt-2'
                }
            />
        </form>
    );
};

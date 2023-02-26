import { ReactComponent as ArrowLeft } from '../../assets/images/arrow-left-solid.svg';
import { ReactComponent as ArrowRight } from '../../assets/images/arrow-right-solid.svg';
import { ExpensesList } from '../expensesList';
import { BalanceTable } from '../balanceTable';
import moment, { Moment } from 'moment';
import {BalanceType, ExcerptExpense} from '../../types';
import {useEffect, useState} from "react";
import authAxios from "../../services/authAxios";

type ExpensesType = {
    month: Moment;
    addMonth: CallableFunction;
};
type ExpenseExcerptsResponse = {
    total: number;
    expenses: ExcerptExpense[];
    balance: BalanceType[];
};
export const ExpensesPage = ({
    month,
    addMonth,
}: ExpensesType) => {


    return (
        <div className={'h-full flex flex-col items-center mt-10'}>
            {/*<div className={'flex flex-row gap-5 items-center'}>*/}
            {/*    <ArrowLeft*/}
            {/*        fill={'white'}*/}
            {/*        width={20}*/}
            {/*        height={20}*/}
            {/*        className={'cursor-pointer'}*/}
            {/*        onClick={() => addMonth(-1)}*/}
            {/*    />*/}
            {/*    <p className={'text-pink-50 text-3xl'}>*/}
            {/*        {month.format('MMMM YYYY')}*/}
            {/*    </p>*/}
            {/*    <ArrowRight*/}
            {/*        fill={'white'}*/}
            {/*        width={20}*/}
            {/*        height={20}*/}
            {/*        className={'cursor-pointer'}*/}
            {/*        onClick={() => addMonth(1)}*/}
            {/*    />*/}
            {/*</div>*/}

            {/*{expenses ? <ExpensesList expenses={expenses} /> : null}*/}
            {/*<div className={'w-96 md:w-128 xl:w-140 mt-10'}>*/}
            {/*    <p*/}
            {/*        className={*/}
            {/*            'text-pink-50 text-2xl md:text-3xl font-semibold  mb-2'*/}
            {/*        }*/}
            {/*    >*/}
            {/*        Balance*/}
            {/*    </p>*/}

            {/*    {balance ? (*/}
            {/*        <BalanceTable balance={balance} total={total} />*/}
            {/*    ) : null}*/}
            {/*</div>*/}
        </div>
    );
};

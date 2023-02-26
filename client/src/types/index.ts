export type BalanceType = {
    executor: string;
    expensesCount: number;
    totalAmount: number;
};
export type UserType = {
    username: string;
    email: string;
    _id: string;
};

export type ExcerptExpense = {
    _id: string;
    amount: number;
    shop?: string,
    executor: UserType;
    participants: UserType[];
    transactionDate: Date;
};

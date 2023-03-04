export type BalanceType = {
    executor: string;
    expensesCount: number;
    totalAmount: number;
};
export type UserType = {
    username: string;
    email: string;
};

export type ShopType = {
    _id: string;
    name: string;
};

export type ExcerptExpense = {
    _id: string;
    amount: number;
    shop?: string;
    executor: UserType;
    participants: UserType[];
    transactionDate: Date;
};

export type ExpenseResponse = {
    _id: string;
    name: string;
    amount: number;
    executor: UserType;
    participants: Array<UserType>;
    shop: string;
    transactionDate: Date;
    updatedAt: Date;
};

export type Violation<T> = {
    children: any;
    constraints: ErrorType;
    property: string;
    target: T;
};

export type ErrorType = {
    [value: string]: string;
};

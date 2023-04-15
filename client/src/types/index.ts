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

export type AccessTokenPayload = {
    username: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
    type: 'auth';
};

export type ExcerptExpense = {
    _id: string;
    amount: number;
    shop?: string;
    executor: UserType;
    participants: UserType[];
    transactionDate: Date;
};

export type Expense = {
    _id: string;
    name: string;
    amount: number;
    executor: UserType;
    participants: Array<UserType>;
    shop: string;
    transactionDate: Date;
    updatedAt: Date;
    [key: string]: unknown;
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

export enum ModalEnum {
    COMMON = 'common',
    CONFIRMATION = 'confirmation',
}

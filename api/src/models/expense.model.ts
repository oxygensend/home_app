import { model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { DateTime } from 'luxon';
import { RelatedUserInterface } from './user.model';

export interface ExpenseInterface extends Document {
    _id: string;
    amount: number;
    name?: string;
    shop?: string;
    executor: RelatedUserInterface;
    participants: Array<RelatedUserInterface>;
    transactionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<RelatedUserInterface>({
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: false,
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: false,
    },
});

const expenseSchema = new Schema<ExpenseInterface>({
    amount: {
        type: Number,
        min: 0,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    shop: {
        type: String,
        required: false,
    },
    executor: userSchema,
    participants: [userSchema],
    transactionDate: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: false,
        default: DateTime.now().toJSDate(),
    },
    createdAt: {
        type: Date,
        required: true,
        default: DateTime.now().toJSDate(),
    },
});

export const Expense = model<ExpenseInterface>('Expense', expenseSchema);

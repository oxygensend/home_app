import {model, Schema} from "mongoose";

export interface IUser {
    _id?: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string,
    role: "user" | "admin",

    save(): void,

}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    surname: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: false,
        unique: true
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: false,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }

})


export const User = model<IUser>('User', userSchema);
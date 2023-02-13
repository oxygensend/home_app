import {model, Schema} from "mongoose";

export interface UserInterface {
    _id?: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string,
    role: "user" | "admin",

    save(): void,

}

const userSchema = new Schema<UserInterface>({
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


export const User = model<UserInterface>('User', userSchema);
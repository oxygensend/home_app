import {DtoInterface} from "./dto.interface";
import {IsString} from "class-validator";

export class LoginDto implements DtoInterface {

    @IsString()
    private _username: string;

    @IsString()
    private _password: string;


    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }
}
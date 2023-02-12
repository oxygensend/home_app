import {DtoInterface} from "./dto.interface";
import {IsString} from "class-validator";

export class RefreshTokenDto implements DtoInterface {

    @IsString()
    private _token: string

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }
}
import { DtoInterface } from './dto.interface';
import { IsString } from 'class-validator';

export class LoginDto implements DtoInterface {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

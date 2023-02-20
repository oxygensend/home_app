import { Required } from '../../decorators/validation';
import { IsEmail, IsString } from 'class-validator';
import { DtoInterface } from './dto.interface';

export class RelatedUserDto implements DtoInterface {
    @Required()
    @IsString()
    username: string;

    @Required()
    @IsEmail()
    email: string;
}

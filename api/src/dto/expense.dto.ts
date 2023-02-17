import { DtoInterface } from './dto.interface';
import {
    IsArray,
    IsDateString,
    IsNumber,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { ExistingUser, Required } from '../decorators/validation';
import { Type } from 'class-transformer';
import { RelatedUserDto } from './related.user.dto';

export class ExpenseDto implements DtoInterface {
    name: string;

    @IsNumber()
    @Required()
    amount: number;

    shop: string;

    @IsObject()
    @ValidateNested()
    @Type(() => RelatedUserDto)
    @ExistingUser()
    executor: RelatedUserDto;

    @Required()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RelatedUserDto)
    participants: Array<RelatedUserDto>;

    @IsDateString()
    @Required()
    transactionDate: Date;
}

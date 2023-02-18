import { DtoInterface } from './dto.interface';
import {
    IsArray,
    IsDateString,
    IsNumber,
    IsObject, IsOptional, IsString,
    ValidateNested,
} from 'class-validator';
import { ExistingUser, Required } from '../decorators/validation';
import { Type } from 'class-transformer';
import { RelatedUserDto } from './related.user.dto';

export class ExpenseDto implements DtoInterface {
    @IsString()
    @IsOptional()
    name: string;

    @IsNumber()
    @Required()
    amount: number;

    @IsString()
    @IsOptional()
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

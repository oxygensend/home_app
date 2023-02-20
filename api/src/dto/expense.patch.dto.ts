import {
    IsArray,
    IsDateString,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ExistingUser } from '../decorators/validation';
import { Type } from 'class-transformer';
import { RelatedUserDto } from './related.user.dto';
import { DtoInterface } from './dto.interface';

export class ExpensePatchDto implements DtoInterface {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    shop: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => RelatedUserDto)
    @ExistingUser()
    executor: RelatedUserDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RelatedUserDto)
    participants: Array<RelatedUserDto>;

    @IsOptional()
    @IsDateString()
    transactionDate: Date;
}

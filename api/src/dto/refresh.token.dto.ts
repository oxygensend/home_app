import { DtoInterface } from './dto.interface';
import { IsString } from 'class-validator';

export class RefreshTokenDto implements DtoInterface {
    @IsString()
    token: string;
}

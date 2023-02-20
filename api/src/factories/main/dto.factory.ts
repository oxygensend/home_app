import { validate } from 'class-validator';
import { HttpExceptions } from '../../exceptions';
import { DtoInterface } from '../../dto';
import { plainToInstance } from 'class-transformer';

/**
 * Abstract Factory creating and validating dto instances
 */
export abstract class DtoFactory {
    static async create<T extends DtoInterface>(
        Class: new () => T,
        partial: Partial<T>
    ): Promise<T> {
        const dto = plainToInstance(Class, partial);
        const errors = await validate(dto, { whitelist: true });

        if (errors.length > 0) {
            throw new HttpExceptions.UnprocessableEntity(errors);
        }

        return dto;
    }
}

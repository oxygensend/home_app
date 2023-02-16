import {validate} from "class-validator";
import { HttpExceptions} from "../exceptions/exceptions";
import {DtoInterface} from "../dto/dto.interface";

/**
 * Abstract Factory creating and validating dto instances
 */
export abstract class DtoFactory {
    static async create<T extends DtoInterface>(Class: new () => T, partial: Partial<T>): Promise<T> {

        const dto = Object.assign(new Class(), partial);
        const errors = await validate(dto, {whitelist: true});

        if (errors.length > 0) {
            throw  new HttpExceptions.BadRequest(errors);
        }

        return dto;
    }

}
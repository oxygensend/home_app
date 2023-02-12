import {DtoInterface} from "./dto.interface";
import {validate} from "class-validator";
import {HttpException, HttpExceptions} from "../exceptions/exceptions";

export abstract class DtoFactory {
    static async create<T extends DtoInterface>(Class: new () => T, partial: Partial<T>): Promise<T> {
        console.log(Class, partial);

        const dto = Object.assign(new Class(), partial);

        const errors = await validate(dto, {whitelist: true});

        if (errors.length > 0) {
            throw  new HttpExceptions.BadRequest(errors);
        }

        return dto;
    }

}
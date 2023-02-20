import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export const Required = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'Required',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value !== undefined && value !== null;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} is required`;
                },
            },
        });
    };
};

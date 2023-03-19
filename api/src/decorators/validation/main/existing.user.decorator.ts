import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { User } from '../../../models/user.model';

export const ExistingUser = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'ExisingUser',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (!value) return false;
                    const user = await User.findOne({
                        username: value.username,
                    });

                    return !!user;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} user doesn't exist`;
                },
            },
        });
    };
};

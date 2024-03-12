import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'notEmptyString', async: false })
export class NotEmptyStringValidator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.trim().length > 0;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} não pode conter apenas espaços em branco`;
    }
}

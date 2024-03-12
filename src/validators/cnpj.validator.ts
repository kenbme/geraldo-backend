import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isValidCnpj', async: false })
export class CnpjValidator implements ValidatorConstraintInterface {
    validate(cnpjValue: string, args: ValidationArguments) {
        return cnpjValidator.isValid(cnpjValue);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} deve ser um CNPJ válido`;
    }
}

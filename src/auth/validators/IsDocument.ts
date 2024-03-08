import {ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator'
import {validateCNPJ} from 'src/user/validators/IsCNPJ'
import {validateCPF} from 'src/user/validators/IsCPF'

export function IsDocument(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDocument',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validateDocument(value)
        },
        defaultMessage: () => {
          return 'CPF inválido'
        }
      }
    })
  }
}

export const validateDocument = (value: any): boolean => {
  return validateCPF(value) || validateCNPJ(value)
}

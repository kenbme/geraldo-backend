import {ValidationOptions, registerDecorator} from 'class-validator'
import {validateCNPJ} from 'src/shared/user/validators/IsCNPJ'
import {validateCPF} from 'src/shared/user/validators/IsCPF'

export function IsDocument(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDocument',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validateDocument(value)
        },
        defaultMessage: () => {
          return 'Usuário inválido'
        }
      }
    })
  }
}

export const validateDocument = (value: any): boolean => {
  return validateCPF(value) || validateCNPJ(value)
}

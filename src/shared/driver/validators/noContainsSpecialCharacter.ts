import {ValidationOptions, registerDecorator} from 'class-validator'

export function noContainsSpecialCharacter(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'noContainsSpecialCharacter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return validateName(value)
        },
        defaultMessage: () => {
          return 'O nome não pode conter caracteres especiais'
        }
      }
    })
  }
}

export const validateName = (value: string): boolean => {
  if (typeof value !== 'string') {
    return false
  }
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(value)
}

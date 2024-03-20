import {ValidationOptions, registerDecorator} from 'class-validator'

export function NoContainsSpecialCharacter(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
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
          return 'Não pode conter caracteres especiais'
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

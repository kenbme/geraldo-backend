import {ValidationOptions, registerDecorator} from 'class-validator'

export function noWhiteSpace(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'noWhiteSpace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return noContainsWhiteSpace(value)
        },
        defaultMessage: () => {
          return 'O nome não pode estar em branco'
        }
      }
    })
  }
}

export const noContainsWhiteSpace = (value: string): boolean => {
  if (typeof value !== 'string') {
    return false
  }
  return !/^\s*$/.test(value)
}

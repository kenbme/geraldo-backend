import {ValidationOptions, registerDecorator} from 'class-validator'

export function NoWhiteSpace(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
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
          return 'Não pode estar em branco'
        }
      }
    })
  }
}

export const noContainsWhiteSpace = (value: string): boolean => {
  return value.trim() !== ''
}

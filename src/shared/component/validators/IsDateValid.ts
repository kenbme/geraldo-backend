import {ValidationOptions, registerDecorator} from 'class-validator'

export function isDateValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isDateValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date): boolean {
          return validerDate(value)
        },
        defaultMessage: (): string => {
          return 'Data da ultima troca menor que a atual'
        }
      }
    })
  }
}

export const validerDate = (value: Date): boolean => {
  const dateCurrent = new Date()
  return dateCurrent > value
}

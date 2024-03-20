import {ValidationOptions, registerDecorator} from 'class-validator'

export function IsDateValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isDateValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return validerDate(value)
        },
        defaultMessage: (): string => {
          return 'Data da última troca não pode ser maior do que a atual'
        }
      }
    })
  }
}

export const validerDate = (value?: string): boolean => {
  if (!value) {
    return false
  }
  if (value.length !== 10) {
    return false
  }
  try {
    const splited = value.split('-')
    const year = parseInt(splited[0])
    const month = parseInt(splited[1])
    const day = parseInt(splited[2])
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false
    }
    const currentDate = new Date()
    const userDate = new Date(year, month, day)
    return currentDate >= userDate
  } catch (err) {}
  return false
}

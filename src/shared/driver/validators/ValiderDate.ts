import { ValidationOptions, registerDecorator } from 'class-validator'

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return validateDate(value)
        },
        defaultMessage: () => {
          return 'Data de nascimento não permitida'
        }
      }
    })
  }
}

export const validateDate = (value: string): boolean => {
  if (value.length !== 10) {
    return false
  }
  try {
    const splited = value.split("-")
    const year = parseInt(splited[0])
    if (year < 1) {
      return false
    }
    const month = parseInt(splited[1])
    if (month < 1 && month > 12) {
      return false
    }
    const day = parseInt(splited[2])
    if (day < 1 && day > 31) {
      return false
    }
    const currentDate = new Date()
    const userDate = new Date(year, month, day)
    const diffInYears = (currentDate.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return diffInYears >= 18 && diffInYears <= 100
  } catch (err) { }
  return false
}

import {ValidationOptions, registerDecorator} from 'class-validator'
import { validateDate } from 'src/shared/driver/validators/ValiderDate'

export function isDateValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          return validerDate(value)
        },
        defaultMessage: () => {
          return 'Data da ultima troca menor que a atual'
        }
      }
    })
  }
}

export const validerDate= (value: Date): boolean => {
    const dateCurrent = new Date()
    return dateCurrent > value 

}

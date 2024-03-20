import {ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator'

export function isValidYear(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isValidYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentYear = new Date().getFullYear()
          if (typeof value !== 'number') {
            return false
          }

          if (value <= currentYear + 1) {
            return true
          }
          return false
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser menor ou igual ao ano seguinte ao ano atual`
        }
      }
    })
  }
}

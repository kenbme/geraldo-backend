import {ValidationOptions, registerDecorator} from 'class-validator'

export function validerData(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'validerData',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          return validateDate(value)
        },
        defaultMessage: () => {
          return 'Data de nascimento não permitida'
        }
      }
    })
  }
}

export const validateDate = (value: Date): boolean => {
  if (!(value instanceof Date)) {
    return false
  }

  const anoAtual: number = new Date().getFullYear()
  const anoDaData: number = value.getFullYear()
  const diferencaEmAnos: number = anoAtual - anoDaData

  return diferencaEmAnos > 17 && diferencaEmAnos <= 100
}

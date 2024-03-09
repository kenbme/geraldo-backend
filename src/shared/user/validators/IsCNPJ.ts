import {ValidationOptions, registerDecorator} from 'class-validator'

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'IsCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validateCNPJ(value)
        },
        defaultMessage: () => {
          return 'CNPJ inválido'
        }
      }
    })
  }
}

export const validateCNPJ = (value: any): boolean => {
  if (typeof value !== 'string') {
    return false
  }
  if (value.length != 14 || sameDigits(value)) {
    return false
  }
  let produto1 = 0
  let produto2 = 0
  let valorD1 = 0
  let valorD2 = 0
  const digito1 = parseInt(value.charAt(12))
  const digito2 = parseInt(value.charAt(13))
  const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  for (let i = 0; i < pesos.length; i++) {
    produto1 += parseInt(value.charAt(i)) * pesos[i]
    produto2 += parseInt(value.charAt(i)) * pesos2[i]
  }
  produto2 += digito1 * 2
  if (produto1 % 11 < 2) {
    valorD1 = 0
  } else {
    valorD1 = 11 - (produto1 % 11)
  }
  if (produto2 % 11 < 2) {
    valorD2 = 0
  } else {
    valorD2 = 11 - (produto2 % 11)
  }
  if (digito1 !== valorD1 || digito2 !== valorD2) {
    return false
  }
  return true
}
function sameDigits(value: string): boolean {
  const firstChar = value.charAt(0)
  for (let j = 1; j < value.length; j++) {
    if (value.charAt(j) !== firstChar) {
      return false
    }
  }
  return true
}

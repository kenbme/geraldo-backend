import {ValidationOptions, registerDecorator} from 'class-validator'

export function IsCPF(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validateCPF(value)
        },
        defaultMessage: () => {
          return 'CPF inválido'
        }
      }
    })
  }
}

export const validateCPF = (value: any): boolean => {
  if (!value || typeof value !== 'string' || value.length !== 11 || sameDigits(value)) {
    return false
  }
  let produto1 = 0
  let produto2 = 0
  let valorD1 = 0
  let valorD2 = 0
  const digito1 = parseInt(value.charAt(9))
  const digito2 = parseInt(value.charAt(10))
  for (let i = 0; i < 9; i++) {
    produto1 += parseInt(value.charAt(i)) * (10 - i)
    produto2 += parseInt(value.charAt(i)) * (11 - i)
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

import { IsString, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'
import { User } from 'src/user/entities/user.entity'

export class LoginDTO {
  @IsString()
  username: string
  @IsString()
  password: string
}

export function isCPF(validationOptions?: ValidationOptions) {
  return function (object: User, propertyName: keyof User) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (value.length !== 11) {
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
      }
    })
  }
}

export function isCNPJ(validationOptions?: ValidationOptions) {
  return function (object: User, propertyName: keyof User) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (value.length != 14) {
            return false
          }
          let produto1 = 0
          let produto2 = 0
          let valorD1 = 0
          let valorD2 = 0
          const digito1 = parseInt(value.charAt(12))
          const digito2 = parseInt(value.charAt(13))
          const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
          for (let i = 0; i < pesos.length; i++) {
            produto1 += parseInt(value.charAt(i)) * pesos[i]
            produto2 += parseInt(value.charAt(i)) * (pesos[i] + i)
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
      }
    })
  }
}
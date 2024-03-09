import {IsEmail} from 'class-validator'

export class RecoverPasswordDto {
  @IsEmail({}, {message: 'Email inválido'})
  email: string
}

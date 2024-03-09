import {IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator'
import {IsCPF} from 'src/shared/user/validators/IsCPF'

export class CreateDriverDto {
  @IsCPF()
  username: string

  @IsString({message: 'Nome inválido'})
  @MinLength(4, {message: 'O nome deve ter pelo menos 4 caracteres'})
  name: string

  @IsEmail({}, {message: 'Email inválido'})
  email: string

  @IsNotEmpty({message: 'Data de nascimento inválida'})
  @IsDateString({}, {message: 'A data de nascimento deve estar em um formato válido'})
  birthday: string
}

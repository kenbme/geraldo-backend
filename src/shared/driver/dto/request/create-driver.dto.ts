import {IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator'
import {IsCPF} from 'src/shared/user/validators/IsCPF'

export class CreateDriverDto {
  @IsCPF()
  username: string

  @IsString({message: 'O nome deve ser válido'})
  @MinLength(4, {message: 'O nome deve ter pelo menos 4 caracteres'})
  name: string

  @IsEmail({}, {message: 'O email deve ser um email válido'})
  email: string

  @IsNotEmpty({message: 'A data de nascimento não pode ser vazia'})
  @IsDateString({}, {message: 'A data de nascimento deve estar em um formato válido'})
  birthday: string
}

import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'
import {IsCPF} from '../../../../shared/user/validators/IsCPF'
import {NoContainsSpecialCharacter} from '../../validators/NoContainsSpecialCharacter'
import {IsValidDate} from '../../validators/ValiderDate'
import {NoWhiteSpace} from '../../validators/NoWhiteSpace'

export class CreateDriverDto {
  @IsNotEmpty()
  @IsCPF()
  username: string

  @IsNotEmpty()
  @IsString({message: 'Nome inválido'})
  @MinLength(4, {message: 'O nome deve ter pelo menos 4 caracteres'})
  @NoContainsSpecialCharacter({message: 'O nome não pode ter caracteres especiais'})
  @NoWhiteSpace({message: 'O nome não pode estar em branco'})
  name: string

  @IsNotEmpty()
  @IsEmail({}, {message: 'Email inválido'})
  email: string

  @IsNotEmpty()
  @IsValidDate({message: 'Data de nascimento inválida'})
  birthday: string
}

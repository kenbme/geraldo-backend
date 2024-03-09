import {IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator'
import {IsCPF} from 'src/shared/user/validators/IsCPF'
import {validerData} from '../../validators/validerDate'
import {noContainsSpecialCharacter} from '../../validators/noContainsSpecialCharacter'
import {noWhiteSpace} from '../../validators/noWhiteSpace'
export class CreateDriverDto {
  @IsNotEmpty({message: 'o cpf não pode ser vazio'})
  @IsString({message: 'O cpf deve ser válido'})
  @MaxLength(11, {message: 'o cpf não deve exceder 11 caracteres'})
  @MinLength(11, {message: 'o cpf deve ter 11 caracteres'})
  @IsCPF()
  username: string

  @IsNotEmpty({message: 'O nome não pode ser vazio'})
  @IsString({message: 'O nome deve ser válido'})
  @MinLength(5, {message: 'o nome deve ter mais que 4 caracteres'})
  @noContainsSpecialCharacter()
  @noWhiteSpace()
  name: string

  @IsNotEmpty({message: 'O email não pode ser vazio'})
  @IsEmail({}, {message: 'O email deve ser um email válido'})
  email: string

  @IsNotEmpty({message: 'A data de nascimento não pode ser vazia'})
  @IsDateString({}, {message: 'A data de nascimento deve estar em um formato válido'})
  @validerData()
  birthday: string
}

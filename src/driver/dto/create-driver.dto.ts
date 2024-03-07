import {IsDateString, IsEmail, IsNotEmpty, IsString, Max, MaxDate, MaxLength, MinDate, MinLength} from 'class-validator'

export class CreateDriverDto {
  @IsNotEmpty({ message: 'o cpf não pode ser vazio' })
  @IsString({ message: 'O cpf deve ser válido' })
  @MaxLength(12,{message: 'o cpf não deve exceder 11 caracteres'})
  @MinLength(11,{message: 'o cpf deve ter 11 caracteres'})
  username: string;

  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsString({ message: 'O nome deve ser válido' })
  @MinLength(5,{message: 'o nome deve ter mais que 4 caracteres'})
  name: string;

  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  @IsEmail({}, { message: 'O email deve ser um email válido' })
  email: string;

  @IsNotEmpty({ message: 'A data de nascimento não pode ser vazia' })
  @IsDateString({}, { message: 'A data de nascimento deve estar em um formato válido' })
  @MaxDate(new Date(2006),{message: 'Data de nascimento não permitida'})
  @MinDate(new Date(1923),{message: 'Data de nascimento não permitida'})
  birthday: string;
}

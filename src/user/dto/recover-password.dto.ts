import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty({ message: 'Campo Obrigatório' })
  @IsEmail({}, { message: 'Formato inválido' })
  email: string;
}
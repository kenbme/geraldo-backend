import { IsEmail } from 'class-validator';

export class RecoverPasswordDto {
  @IsEmail({}, { message: 'Formato inválido' })
  email: string;
}
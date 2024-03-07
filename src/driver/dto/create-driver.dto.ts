import {IsDateString, IsEmail, IsString} from 'class-validator'

export class CreateDriverDto {
  @IsString()
  username: string
  @IsString()
  name: string
  @IsEmail({}, {message: 'Email deve ser um email válido'})
  email: string
  @IsDateString()
  birthday: string
}

import {IsDateString, IsEmail, IsString} from 'class-validator'

export class CreateDriverDto {
  @IsString()
  username: string
  @IsString()
  password: string
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsDateString()
  birthday: string
}

import {IsDateString, IsEmail, IsString} from 'class-validator'

export class CreateDriverDto {
  @IsString()
  username: string
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsDateString()
  birthday: string
}

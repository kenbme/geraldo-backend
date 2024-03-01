import {IsString, IsEmail, IsDate} from 'class-validator'

export class UpdateUserDto {
  @IsString()
  username: string | undefined
  @IsString()
  password: string | undefined
  @IsString()
  name: string | undefined
  @IsEmail()
  email: string | undefined
  @IsDate()
  birthday: Date | undefined
}

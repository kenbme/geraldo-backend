import {IsString, IsEmail} from 'class-validator'

export class UpdateUserDto {
  @IsString()
  name: string | undefined
  @IsEmail()
  email: string | undefined
  @IsString()
  password: string | undefined
}

import {IsEmail, IsEnum, IsString} from 'class-validator'
import {UserRole} from '../enums/user-role.enum'

export class CreateUserDto {
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsEnum(UserRole)
  role: string
}

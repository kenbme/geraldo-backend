import {IsEmail, IsEnum, IsString} from 'class-validator'
import { UserRole } from '../enums/UserRole'

export class CreateUserDto {
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsEnum(UserRole)
  role: string
}

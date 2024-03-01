import {IsDate, IsEmail, IsEnum, IsString} from 'class-validator'
import {UserTypeEnum} from '../enums/user-type.enum'

export class CreateUserDto {
  @IsString()
  username: string
  @IsString()
  password: string
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsDate()
  birthday: Date
  @IsEnum(UserTypeEnum)
  userType: string
}

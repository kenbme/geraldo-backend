import {IsDateString, IsEmail, IsEnum, IsString} from 'class-validator'
import {UserTypeEnum} from '../../enums/user-type.enum'

export class CreateUserDto {
  @IsString()
  username: string
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsDateString()
  birthday?: string
  @IsEnum(UserTypeEnum)
  userType: string
}

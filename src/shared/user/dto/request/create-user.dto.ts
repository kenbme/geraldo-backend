import {IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString} from 'class-validator'
import {UserTypeEnum} from '../../enums/user-type.enum'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string
  @IsNotEmpty()
  @IsString()
  name: string
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsNotEmpty()
  @IsDateString()
  birthday?: string
  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  userType: UserTypeEnum
}

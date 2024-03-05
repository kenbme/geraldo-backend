import {Equals, IsString} from 'class-validator'
import {CreateUserDto} from 'src/user/dto/create-user.dto'
import {UserTypeEnum} from 'src/user/enums/user-type.enum'

export class CreateDriverDto extends CreateUserDto {
  @IsString()
  @Equals(UserTypeEnum.DRIVER)
  userType: string
}

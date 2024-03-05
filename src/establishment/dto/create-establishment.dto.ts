import { IsString, Equals } from 'class-validator'
import {CreateUserDto} from 'src/user/dto/create-user.dto'
import { UserTypeEnum } from 'src/user/enums/user-type.enum'

export class CreateEstablishmentDto extends CreateUserDto {
    @IsString()
    @Equals(UserTypeEnum.ESTABLISHMENT)
    userType: string
}

import { IsString, Equals, IsNumber, IsEnum, IsInt, MIN, Min } from 'class-validator'
import {CreateUserDto} from 'src/user/dto/create-user.dto'
import { UserTypeEnum } from 'src/user/enums/user-type.enum'
import { EstablishmentType } from '../entities/establishment.type.entity'
import { EstablishmentTypeEnum } from '../enums/establishment-type.enum'

export class CreateEstablishmentDto extends CreateUserDto {
    @IsString()
    @Equals(UserTypeEnum.ESTABLISHMENT)
    userType: string
    @IsString()
    areaCode: string
    @IsString()
    phone: string
    @IsInt()
    alwaysOpen: number
    @IsEnum(EstablishmentTypeEnum)
    establishmentType: string
}

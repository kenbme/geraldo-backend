import {IsString, IsEnum, IsEmail} from 'class-validator'
import {EstablishmentTypeEnum} from '../../enums/establishment-type.enum'
import {IsCNPJ} from 'src/shared/user/validators/IsCNPJ'

export class CreateEstablishmentDto {
  @IsString()
  @IsCNPJ()
  username: string
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsEnum(EstablishmentTypeEnum)
  establishmentType: string

  @IsString()
  areaCode: string
  @IsString()
  phone: string

  @IsString()
  postalCode: string
  @IsString()
  houseNumber: string
}

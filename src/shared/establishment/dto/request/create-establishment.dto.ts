import {IsString, IsEnum, IsEmail, MinLength, Length} from 'class-validator'
import {EstablishmentTypeEnum} from '../../enums/establishment-type.enum'
import {IsCNPJ} from '../../../../shared/user/validators/IsCNPJ'

export class CreateEstablishmentDto {
  @IsCNPJ()
  username: string
  @MinLength(4)
  name: string
  @IsEmail()
  email: string
  @IsEnum(EstablishmentTypeEnum)
  establishmentType: string

  @IsString()
  areaCode: string
  @IsString()
  phone: string

  @Length(8)
  postalCode: string
  @IsString()
  houseNumber: string
}

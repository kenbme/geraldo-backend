import {IsString, IsEnum, IsEmail, MinLength, Length, IsNotEmpty} from 'class-validator'
import {EstablishmentTypeEnum} from '../../enums/establishment-type.enum'
import {IsCNPJ} from '../../../../shared/user/validators/IsCNPJ'

export class CreateEstablishmentDto {
  @IsNotEmpty()
  @IsCNPJ()
  username: string
  @IsNotEmpty()
  @MinLength(4)
  name: string
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsNotEmpty()
  @IsEnum(EstablishmentTypeEnum)
  establishmentType: EstablishmentTypeEnum
  @IsNotEmpty()
  @IsString()
  areaCode: string
  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @Length(8)
  postalCode: string
  @IsNotEmpty()
  @IsString()
  houseNumber: string
}

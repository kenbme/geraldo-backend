import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, MinLength } from 'class-validator'
import { IsCNPJ } from '../../../../shared/user/validators/IsCNPJ'
import { EstablishmentTypeEnum } from '../../enums/establishment-type.enum'

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

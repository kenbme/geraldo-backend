import {IsString, IsEnum, IsEmail} from 'class-validator'
import {EstablishmentTypeEnum} from '../enums/establishment-type.enum'

export class CreateEstablishmentDto {
  @IsString()
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
  @IsString()
  street: string
}

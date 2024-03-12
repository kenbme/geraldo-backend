import {IsString, IsEnum, IsEmail, MinLength, IsNotEmpty, Matches, Length, Validate} from 'class-validator'
import {EstablishmentTypeEnum} from '../enums/establishment-type.enum'
import { NotEmptyStringValidator } from 'src/validators/not-empty-string.validator'
import { CnpjValidator } from 'src/validators/cnpj.validator'

export class CreateEstablishmentDto {
  @IsString()
  @Validate(NotEmptyStringValidator)
  @Validate(CnpjValidator)
  username: string
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\s]*$/, { message: 'A entrada não pode conter caracteres especiais' })
  @Validate(NotEmptyStringValidator)
  name: string
  @IsEmail()
  email: string
  @IsEnum(EstablishmentTypeEnum)
  establishmentType: string

  @IsString()
  areaCode: string
  @IsString()
  phone: string

  @IsString({})
  @Length(8)
  postalCode: string
  @IsString()
  houseNumber: string
  @IsString()
  street: string
}

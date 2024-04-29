import {IsString, IsEmail, MinLength, Length, IsNotEmpty} from 'class-validator'

export class UpdateEstablishmentDto {
  @IsNotEmpty({message: 'Campo obrigatório'})
  @MinLength(4)
  name: string

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsEmail()
  email: string

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsString()
  areaCode: string

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsString()
  phone: string

  @IsNotEmpty({message: 'Campo obrigatório'})
  @Length(8)
  postalCode: string

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsString()
  houseNumber: string
}

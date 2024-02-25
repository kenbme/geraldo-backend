import {IsString} from 'class-validator'

export class AddressDto {
  @IsString()
  estado: string
  @IsString()
  cidade: string
  @IsString()
  bairro: string
  @IsString()
  rua: string
}

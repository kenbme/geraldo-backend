import {IsString} from 'class-validator'

export class AddressDto {
  @IsString()
  state: string
  @IsString()
  city: string
  @IsString()
  district: string
  @IsString()
  street: string
  @IsString()
  uf: string
}

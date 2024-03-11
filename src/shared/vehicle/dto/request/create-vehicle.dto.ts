import { IsInt, IsNotEmpty, IsString } from 'class-validator'
import { isValidYear } from '../../validators/isValidYear'

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  model: string

  @IsString()
  @IsNotEmpty()
  plate: string

  @IsInt()
  @IsNotEmpty()
  kilometers: number

  @IsInt()
  @IsNotEmpty()
  @isValidYear()
  year: number
}

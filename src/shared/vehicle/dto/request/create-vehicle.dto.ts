import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { isValidYear } from '../../validators/isValidYear'
import { UUID } from 'crypto'

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

  @IsUUID()
  driverId: UUID
}

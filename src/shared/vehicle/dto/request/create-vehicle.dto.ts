import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  model: string

  @IsString()
  @IsNotEmpty()
  plate: string

  @IsInt()
  kilometers: number

  @IsInt()
  year: number
}

import {IsInt, IsNotEmpty, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsNotEmpty()
  @IsInt()
  vehicleId: number

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  kilometers: number
}

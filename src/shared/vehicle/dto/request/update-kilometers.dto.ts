import {IsNotEmpty, IsInt, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsNotEmpty()
  @IsInt()
  driverId: number

  @IsNotEmpty()
  @IsInt()
  vehicleId: number

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  kilometers: number
}

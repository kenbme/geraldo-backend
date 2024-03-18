import {IsInt, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsInt()
  driverId: number

  @IsInt()
  vehicleId: number

  @IsInt()
  @Min(0)
  kilometers: number
}

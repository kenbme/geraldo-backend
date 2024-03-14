import {IsInt, Min} from 'class-validator'
import {UUID} from 'crypto'

export class UpdateKilometersDto {
  driverId: UUID

  vehicleId: UUID

  @IsInt()
  @Min(0)
  kilometers: number
}

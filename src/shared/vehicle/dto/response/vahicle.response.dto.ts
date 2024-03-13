import { UUID } from 'crypto'
import { Vehicle } from 'src/vehicle/entities/vehicle.entity'

export class VehicleResponseDTO {
  uuid: UUID
  model: string
  plate: string
  year: number
  kilometers: number

  constructor(vehicle: Vehicle) {
    this.uuid = vehicle.uuid
    this.model = vehicle.model
    this.plate = vehicle.plate
    this.year = vehicle.year
    this.kilometers = vehicle.kilometers
  }
}

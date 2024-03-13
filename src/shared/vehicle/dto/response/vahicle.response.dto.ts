import { UUID } from 'crypto'

export class VehicleResponseDTO {
  uuid: UUID
  model: string
  plate: string
  year: number
  kilometers: number
}

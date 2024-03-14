import {UUID} from 'crypto'

export class VehicleResponseDTO {
  id: UUID
  model: string
  plate: string
  year: number
  kilometers: number
}

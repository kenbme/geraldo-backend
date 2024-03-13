import {UUID} from 'crypto'

export class DriverResponseDTO {
  id: UUID
  username: string
  name: string
  email: string
  birthday: Date
}

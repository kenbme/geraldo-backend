import {UUID} from 'crypto'

export class DriverResponseDTO {
  uuid: UUID
  username: string
  name: string
  email: string
  birthday: Date
}

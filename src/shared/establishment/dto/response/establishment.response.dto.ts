import {UUID} from 'crypto'

export class EstablishmentResponseDTO {
  uuid: UUID
  username: string
  name: string
  email: string
  birthday: Date
}

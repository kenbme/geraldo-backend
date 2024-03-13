import {UUID} from 'crypto'

export class EstablishmentResponseDTO {
  id: UUID
  username: string
  name: string
  email: string
  birthday: Date
}

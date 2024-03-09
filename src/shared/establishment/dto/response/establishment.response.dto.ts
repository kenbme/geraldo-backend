import {UUID} from 'crypto'
import {Establishment} from 'src/establishment/entities/establishment.entity'

export class EstablishmentResponseDTO {
  uuid: UUID
  username: string
  name: string
  email: string
  birthday: Date

  constructor(establishment: Establishment) {
    this.uuid = establishment.uuid
    this.email = establishment.user.email
    this.birthday = establishment.user.birthday
    this.name = establishment.user.name
    this.username = establishment.user.username
  }
}

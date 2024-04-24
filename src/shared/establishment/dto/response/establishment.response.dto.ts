import { Address } from "src/address/entities/address.entity"
import { Fuel } from "src/fuel/entities/fuel.entity"

export class EstablishmentResponseDTO {
  id: number
  username: string
  name: string
  email: string
  birthday: Date
  fuels: Fuel[]
  address: Address
}

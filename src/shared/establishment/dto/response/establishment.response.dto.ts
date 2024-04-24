import { Address } from "../../../../address/entities/address.entity"
import { Fuel } from "../../../../fuel/entities/fuel.entity"

export class EstablishmentResponseDTO {
  id: number
  username: string
  name: string
  email: string
  birthday: Date
  fuels: Fuel[]
  address: Address
}

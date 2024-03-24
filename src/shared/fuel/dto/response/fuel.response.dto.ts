import { FuelTypeEnum } from "../../enum/fuel.type.enum"

export class FuelResponseDTO {
    id: number
    fuelType: FuelTypeEnum
    fuelTitle: string
    value: number
    productStatus: boolean
  }
  
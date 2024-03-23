import { FuelTypeEnum } from "../../enum/fuelTypeEnum"

export class FuelResponseDTO {
    id: number
    fuelType: FuelTypeEnum
    fuelTitle: string
    value: number
    productStatus: boolean
  }
  
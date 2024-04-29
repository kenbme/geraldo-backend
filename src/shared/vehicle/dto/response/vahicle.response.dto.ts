import { Component } from "src/component/entities/component.entity"

export class VehicleResponseDTO {
  id: number
  model: string
  plate: string
  year: number
  kilometers: number
  components: Component[]
}

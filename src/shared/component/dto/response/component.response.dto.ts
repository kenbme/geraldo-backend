import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class ComponentResponseDTO {
  id: number
  componentType: ComponentTypeEnum
  dateLastExchange: Date
  kilometersLastExnchange: number
  maintenanceFrequency: number
  vehicleId: number
}

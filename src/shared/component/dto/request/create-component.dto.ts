import {IsEnum, IsInt} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsEnum(ComponentTypeEnum)
  componentType: ComponentTypeEnum

  @IsDateValid()
  dateLastExchange: string

  @IsInt()
  kilometersLastExchange: number

  @IsInt()
  maintenanceFrequency: number

  @IsInt()
  vehicleId: number
}

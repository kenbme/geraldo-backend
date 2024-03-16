import {IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID} from 'class-validator'
import {UUID} from 'crypto'
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

  @IsUUID()
  vehicleId: UUID
}

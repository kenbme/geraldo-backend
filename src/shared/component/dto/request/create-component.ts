import {IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID} from 'class-validator'
import {UUID} from 'crypto'
import {isDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsEnum(ComponentTypeEnum)
  componentType: ComponentTypeEnum

  @IsDate()
  @isDateValid()
  @IsNotEmpty()
  dateLastExchange: Date

  @IsInt()
  @IsNotEmpty()
  kilometersLastExchange: number

  @IsString()
  @IsNotEmpty()
  maintenanceFrequency: number

  @IsUUID()
  vehicleId: UUID
}

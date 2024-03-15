import {IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID} from 'class-validator'
import {UUID} from 'crypto'
import {isDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsEnum(ComponentTypeEnum)
  @IsNotEmpty()
  componentType: string

  @IsDate()
  @isDateValid()
  @IsNotEmpty()
  dateLastExchange: Date

  @IsInt()
  @IsNotEmpty()
  kilometersLastExnchange: number

  @IsString()
  @IsNotEmpty()
  maintenanceFrequency: number

  @IsUUID()
  vehicleId: UUID
}

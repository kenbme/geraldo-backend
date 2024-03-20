import {IsEnum, IsInt, IsNotEmpty} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsNotEmpty()
  @IsEnum(ComponentTypeEnum)
  componentType: ComponentTypeEnum

  @IsNotEmpty()
  @IsDateValid()
  dateLastExchange: string
  
  @IsNotEmpty()
  @IsInt()  
  kilometersLastExchange: number
  
  @IsNotEmpty()
  @IsInt()
  maintenanceFrequency: number
  
  @IsNotEmpty()
  @IsInt()
  vehicleId: number
}

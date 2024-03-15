import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, isNotEmpty } from 'class-validator'
import { ComponentsTypeEnum } from '../../enums/components-type.enum'
import { UUID } from 'crypto'
import { isDateValid } from '../../validators/IsDateValid'

export class CreateComponentsDto {
  
  @IsEnum(ComponentsTypeEnum)
  @IsNotEmpty()
  componentsType: string
  
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
  vehicleUuid: UUID
    
}

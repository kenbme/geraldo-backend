import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { isValidYear } from 'src/shared/vehicle/validators/isValidYear'
import { ComponentsTypeEnum } from '../../enums/components-type.enum'

export class CreateComponentsDto {
  
  @IsEnum(ComponentsTypeEnum)
  componentsType: string
  
  @IsDate()
  @isValidYear()
  dateLastExchange: Date

  @IsInt()
  @IsNotEmpty()
  kilometersLastExnchange: number

  @IsString()
  @IsNotEmpty()
  maintenanceFrequency: number

  @IsUUID()
  vehicleUuid: string
    
}

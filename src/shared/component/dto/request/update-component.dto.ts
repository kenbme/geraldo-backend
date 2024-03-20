import {IsInt, IsNotEmpty} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'

export class UpdateComponentDto {
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

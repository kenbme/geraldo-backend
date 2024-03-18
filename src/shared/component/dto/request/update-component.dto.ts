import {IsInt} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'

export class UpdateComponentDto {
  @IsDateValid()
  dateLastExchange: string

  @IsInt()
  kilometersLastExchange: number

  @IsInt()
  maintenanceFrequency: number

  @IsInt()
  vehicleId: number
}

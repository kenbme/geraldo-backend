import { IsInt, IsUUID } from "class-validator"
import { IsDateValid } from "../../validators/IsDateValid"
import { UUID } from "crypto"

export class UpdateComponentDto {  
    @IsDateValid()
    dateLastExchange: string
  
    @IsInt()
    kilometersLastExchange: number
  
    @IsInt()
    maintenanceFrequency: number
  
    @IsUUID()
    vehicleId: UUID
}
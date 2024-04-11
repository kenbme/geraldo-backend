import { Establishment } from "src/establishment/entities/establishment.entity"
import { Shift } from "src/schedule/entities/shift.entity"

export class ScheduleResponseDTO{
    id: number
    shifts: Shift[]
    establishment: Establishment
}
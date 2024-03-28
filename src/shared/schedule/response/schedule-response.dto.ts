import { Establishment } from "src/establishment/entities/establishment.entity"
import { Shift } from "src/schedule/entities/shift.entity"

export class ScheduleResponseDTO{
    id: number
    working_days: string
    shifts: Shift[]
    establishment: Establishment
}
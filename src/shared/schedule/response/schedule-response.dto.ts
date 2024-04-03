import { Establishment } from "../../../establishment/entities/establishment.entity"
import { Shift } from "../../../schedule/entities/shift.entity"

export class ScheduleResponseDTO{
    id: number
    shifts: Shift[]
    establishment: Establishment
}
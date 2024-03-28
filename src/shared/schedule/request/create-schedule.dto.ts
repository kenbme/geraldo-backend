import { IsNotEmpty } from "class-validator"

export class CreateScheduleDto{
    @IsNotEmpty({message: 'Os dias da semana não pode ser vazio'})
    working_days: string
    shifts: string[][]
    always_open: Boolean
}

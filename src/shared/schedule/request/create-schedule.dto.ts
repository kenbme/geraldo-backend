import { ArrayMaxSize, IsNotEmpty } from "class-validator";

export class CreateScheduleDto {

    @ArrayMaxSize(3, { message: 'O número máximo de turnos é 3' })
    shifts: string[][]

    always_open: boolean
}
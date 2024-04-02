import { ArrayMaxSize, IsNotEmpty } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty({ message: 'Os dias da semana não podem ser vazios' })
    working_days: string

    @ArrayMaxSize(3, { message: 'O número máximo de turnos é 3' })
    shifts: string[][]

    always_open: boolean
}
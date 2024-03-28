import { Body, Controller, Param, Post } from "@nestjs/common";
import { Public } from "src/config/decorator";
import { CreateScheduleDto } from "src/shared/schedule/request/create-schedule.dto";
import { ScheduleResponseDTO } from "src/shared/schedule/response/schedule-response.dto";
import { createScheduleDTO } from "src/util/mapper";
import { ScheduleService } from "./schedule.service";

@Controller('')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Post('/establishment/:establishmentId/openinghours')
    @Public()
    async create(
        @Param('establishmentId') establishmentId: number,
        @Body() createScheduleDto: CreateScheduleDto
    ): Promise<{ data: ScheduleResponseDTO; message: string }> {
        const schedule = await this.scheduleService.create(createScheduleDto, establishmentId)
        
        const data = createScheduleDTO(schedule)
        return { data: data, message: 'Horario cadastrado com sucesso' }
    }
}

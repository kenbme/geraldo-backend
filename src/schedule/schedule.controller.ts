import { Body, Controller, HttpCode, Param, Post, UnauthorizedException } from "@nestjs/common";
import { Roles } from "src/config/decorator";
import { UserRequest } from "src/shared/auth/dto/user.request";
import { CreateScheduleDto } from "src/shared/schedule/request/create-schedule.dto";
import { ScheduleResponseDTO } from "src/shared/schedule/response/schedule-response.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { createScheduleDTO } from "src/util/mapper";
import { ScheduleService } from "./schedule.service";

@Controller('')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}
    
    @Roles(UserTypeEnum.ESTABLISHMENT)
    @Post('/establishment/:establishmentId/openinghours')
    @HttpCode(200)
    async create(
        @Request() request: UserRequest,
        @Param('establishmentId') establishmentId: number,
        @Body() createScheduleDto: CreateScheduleDto
    ): Promise<{ data: ScheduleResponseDTO; message: string }> {
        const userId = await request.user.id
        if (!userId) {
          throw new UnauthorizedException()
        }
        const schedule = await this.scheduleService.create(createScheduleDto, establishmentId)
        const data = createScheduleDTO(schedule)
        return { data: data, message: 'Horario cadastrado com sucesso' }
    }
}

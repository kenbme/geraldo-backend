import { Body, Controller, HttpCode, Param, Post, Request, UnauthorizedException } from "@nestjs/common";
import { Roles } from "../config/decorator";
import { CreateScheduleDto } from "../shared/schedule/request/create-schedule.dto";
import { ScheduleResponseDTO } from "../shared/schedule/response/schedule-response.dto";
import { UserTypeEnum } from "../shared/user/enums/user-type.enum";
import { createScheduleDTO } from "../util/mapper";
import { ScheduleService } from "./schedule.service";
import { UserRequest } from "../shared/auth/dto/user.request";

@Controller('')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}
    
    @Roles(UserTypeEnum.ESTABLISHMENT)
    @Post('/establishment/openinghours')
    @HttpCode(200)
    async create(
        @Request() request: UserRequest,
        @Body() createScheduleDto: CreateScheduleDto
    ): Promise<{ data: ScheduleResponseDTO; message: string }> {
        const userId = request.user.id
        if (!userId) {
            throw new UnauthorizedException()
        }
        const schedule = await this.scheduleService.create(createScheduleDto, userId)
        const data = createScheduleDTO(schedule)
        return { data: data, message: 'Horario cadastrado com sucesso' }
    }
}

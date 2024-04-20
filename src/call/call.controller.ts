import { Body, Controller, Post, Request, UnauthorizedException } from "@nestjs/common";

import { Roles } from "src/config/decorator";
import { UserRequest } from "src/shared/auth/dto/user.request";
import { CreateCallDTO } from "src/shared/call/dto/request/create-call.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { CallService } from "./call.service";

@Controller('')
export class CallController{

    constructor(readonly callService:CallService){}

    @Post('/emergency_call')
    @Roles(UserTypeEnum.DRIVER)
    async create(@Request() request: UserRequest, @Body() dto: CreateCallDTO){
        const userId = request.user.id
        if(!userId){
            throw new UnauthorizedException()
        }
        console.log(userId)
        const data = this.callService.create(userId,dto)
        return {data, message: 'Chamada de Emegência criada com sucesso'}
    }
}


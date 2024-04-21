import { Body, Controller, Post, Request, UnauthorizedException } from "@nestjs/common";

import { Roles } from "src/config/decorator";
import { UserRequest } from "src/shared/auth/dto/user.request";
import { CreateCallDTO } from "src/shared/call/dto/request/create-call.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { createCallResponseDTO, createResponseToCallResponseDTO } from "src/util/mapper";
import { CallService } from "./call.service";
import { RespondToCallDTO } from "src/shared/call/dto/request/create-response-to-call.dto";

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
        const response = await this.callService.create(userId,dto)
        console.log(response)
        const data = createCallResponseDTO(response)
        return {data, message: 'Chamada de Emegência criada com sucesso'}
    }

    @Post('/respond_call')
    @Roles(UserTypeEnum.ESTABLISHMENT)
    async respond(@Request() request: UserRequest, @Body() dto: RespondToCallDTO) {
    const userId = request.user.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const response = await this.callService.respondCall(userId, dto)
    console.log(response)
    const data = createResponseToCallResponseDTO
    return { data, message: 'Chamada de emergência respondida com sucesso' };
  }
}


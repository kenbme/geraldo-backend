import { Body, Controller, Get, HttpCode, Param, Post, Request, UnauthorizedException } from "@nestjs/common";
import { Roles } from "../config/decorator";
import { UserRequest } from "../shared/auth/dto/user.request";
import { CreateAvaliationDto } from "../shared/avaliation/dto/request/create_avaliation.dto";
import { GetAvaliation } from "../shared/avaliation/dto/response/get_avaliations.dto";
import { UserTypeEnum } from "../shared/user/enums/user-type.enum";
import { createAvaliationResponseDTO } from "../util/mapper";
import { AvaliationService } from "./avaliation.service";
import { Avaliation } from "./entities/avaliation.entity";

@Controller('')
export class AvaliationController{

    constructor(
        private readonly avaliationService: AvaliationService,
    ){}


    @Post('/rate/:establishmentId')
    @Roles(UserTypeEnum.DRIVER)
    @HttpCode(200)
    async create(
        @Request() request: UserRequest,
        @Param ('establishmentId')  establishmentId:number,
        @Body() createAvaliationDto: CreateAvaliationDto
    ): Promise<{data: GetAvaliation; message: string}> {
        const userId = request.user.id
        if(!userId){
            throw new UnauthorizedException()
        }
        const avaliation = await this.avaliationService.create(establishmentId,userId,createAvaliationDto)
        const data = createAvaliationResponseDTO(avaliation)
        return {data, message: 'Avaliação criada com sucesso'}
    }
    @Get('/rate/establishment/:establishmentId')
    @HttpCode(200)
    async getAvaliationByEstablishment(
        @Param ('establishmentId')  establishmentId:number
    ): Promise<{data: Avaliation[]; message: string}>{
        const data = await this.avaliationService.findByEstablishmentId(establishmentId)
        console.log(data)
        return {data, message: 'Avaliações encontradas com sucesso'}
    }
    @Get('/rate/user/:userId')
    @HttpCode(200)
    async getAvaliationByUser(
        @Param ('userId')  userId:number
    ): Promise<{data:Avaliation[]; message: string}>{
        const data = await this.avaliationService.findByUserId(userId)
        return {data, message: 'Avaliações encontradas com sucesso'}
    }
}
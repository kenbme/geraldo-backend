import { Body, Controller, Get, HttpCode, Param, Post, UnauthorizedException } from "@nestjs/common";
import { Roles } from "src/config/decorator";
import { UserRequest } from "src/shared/auth/dto/user.request";
import { CreateAvaliationDto } from "src/shared/avaliation/dto/request/create_avaliation.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { AvaliationService } from "./avaliation.service";
import { Avaliation } from "./entities/avaliation.entity";

@Controller('')
export class AvaliationController{

    constructor(
        private readonly avaliationService: AvaliationService,
    ){}
    @Post('/rate/{establishmentId}')
    @Roles(UserTypeEnum.DRIVER)
    @HttpCode(200)
    async create(
        @Request() request: UserRequest,
        @Param ('establishmentId')  establishmentId:number,
        @Body() createAvaliationDto: CreateAvaliationDto
    ): Promise<Avaliation>{
        const userId = request.user.id
        if(!userId){
            throw new UnauthorizedException()
        }
        const avaliation = this.avaliationService.create(establishmentId,userId,createAvaliationDto)
        return avaliation
    }
    @Get('/rate/{establishmentId}')
    @HttpCode(200)
    async getAvaliation(
        @Request() request: UserRequest,
        @Param ('establishmentId')  establishmentId:number
    ): Promise<Avaliation>{
        const userId = request.user.id
        if(!userId){
            throw new UnauthorizedException()
        }
        const avaliations = this.avaliationService.findByEstablishmentId(establishmentId)
        return avaliations
    }

}
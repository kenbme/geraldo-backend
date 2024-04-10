import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Establishment } from "src/establishment/entities/establishment.entity";
import { EstablishmentService } from "src/establishment/establishment.service";
import { CreateAvaliationDto } from "src/shared/avaliation/dto/request/create_avaliation.dto";
import { GetAvaliation } from "src/shared/avaliation/dto/response/get_avaliations.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { UserService } from "src/user/user.service";
import { createAvaliationResponseDTO } from "src/util/mapper";
import { DataSource, Repository } from "typeorm";
import { Avaliation } from "./entities/avaliation.entity";


@Injectable()
export class AvaliationService{
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Avaliation)
        private readonly avaliationRepository: Repository<Avaliation>,
        private readonly dataSource: DataSource,
        private readonly establishmentService: EstablishmentService){}

    async create(establishmentId:number,userId: number, createAvaliationDto: CreateAvaliationDto):Promise<GetAvaliation>{
        const user = await this.userService.findById(userId)
        if (user.userType.name !== UserTypeEnum.DRIVER) {
            throw new ForbiddenException('Você não pode associar esse usuário')
        }
        let establishment = await this.establishmentService.findById(establishmentId)
        const avaliation = new Avaliation
        avaliation.comment = createAvaliationDto.comment
        avaliation.grade = createAvaliationDto.grade
        avaliation.date = createAvaliationDto.date
        avaliation.establishment = establishment
        avaliation.user = user
        this.avaliationRepository.save(avaliation)
        this.dataSource.manager.save(Avaliation, avaliation)
        establishment = await this.establishmentService.updateGrade(establishmentId)
        this.dataSource.manager.save(Establishment, establishment)
        const response = createAvaliationResponseDTO(avaliation)
        return response
    }
    async findByEstablishmentId(establishmentId: number):Promise<Avaliation>{
        const avaliation = await this.avaliationRepository.findOne({
            where: { establishment: { id: establishmentId} },
            relations: ['establishment', 'user']
        })
        if(!avaliation){
            throw new NotFoundException('Avaliacao não encontrada')
        }
        return avaliation
    }
    async findByUserId(userId: number):Promise<Avaliation>{
        const avaliation = await this.avaliationRepository.findOne({
            where: { user: { id: userId} },
            relations: ['establishment', 'user']
        })
        if(!avaliation){
            throw new NotFoundException('Avaliacao não encontrada')
        }
        return avaliation
    }
}
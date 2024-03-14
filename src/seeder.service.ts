import { Injectable } from "@nestjs/common";
import { EstablishmentType } from "./establishment/entities/establishment.type.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserType } from "./user/entities/user.type.entity";

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(EstablishmentType)
        private readonly establishmentTypeRepository: Repository<EstablishmentType>,
        @InjectRepository(UserType)
        private readonly userTypeRepository: Repository<UserType>
    ) {}

    async seedData() {
        await this.seedEstablishmentType()
        await this.seedUserType()
    }

    async seedEstablishmentType() {
        const data = [
            {name: 'GAS_STATION', description: 'descricao de gas station'},
            {name: 'WORKSHOP', description: 'descricao de workshop'}
        ]
        await this.establishmentTypeRepository.upsert(data,{conflictPaths: ["name"]}) 
    }

    async seedUserType() {
        const data = [
            {name: 'DRIVER', description: 'descricao de driver'},
            {name: 'ESTABLISHMENT', description: 'descricao de establishment'}
        ]
        await this.userTypeRepository.upsert(data,{conflictPaths: ["name"]}) 
    }

}
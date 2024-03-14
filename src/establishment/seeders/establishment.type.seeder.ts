import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EstablishmentType } from "../entities/establishment.type.entity";

@Injectable()
export class EstablishmentTypeSeeder {
    constructor(
        @InjectRepository(EstablishmentType)
        private readonly establishmentTypeRepository: Repository<EstablishmentType>,
    ) {}

    async seedEstablishmentType() {
        const data = [
            {name: 'GAS_STATION', description: 'descricao de gas station'},
            {name: 'WORKSHOP', description: 'descricao de workshop'}
        ]
        await this.establishmentTypeRepository.upsert(data,{conflictPaths: ["name"]}) 
    }

}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserType } from "../entities/user.type.entity";

@Injectable()
export class UserTypeSeeder {
    constructor(
        @InjectRepository(UserType)
        private readonly userTypeRepository: Repository<UserType>
    ) {}

    async seed(): Promise<void> {
        const data = [
            {name: 'DRIVER', description: 'descricao de driver'},
            {name: 'ESTABLISHMENT', description: 'descricao de establishment'}
        ]
        await this.userTypeRepository.upsert(data,{conflictPaths: ["name"]}) 
    }

}
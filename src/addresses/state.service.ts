import { Injectable } from "@nestjs/common";
import { Addresses } from "./entities/addresses.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { City } from "./entities/cities.entity";
import { State } from "./entities/state.entity";
import { CepService } from "src/cep/cep.service";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { randomUUID } from "crypto";


@Injectable()
export class StateService{
    constructor(
    @InjectRepository(State) private readonly statesRepository: Repository<State>
    ){}

    async createState(name: string, uf: string):Promise<State>{
        const newState = new State()
        newState.uuid = randomUUID()
        newState.name= name
        newState.uf = uf
        return await this.statesRepository.save(newState)
    }

    async findStateByUf(uf: string){
        return await this.statesRepository.findOneByOrFail({ uf: uf})
    }

}



import { Injectable } from "@nestjs/common";
import { Addresses } from "./entities/addresses.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { City } from "./entities/cities.entity";
import { State } from "./entities/state.entity";
import { CepService } from "src/cep/cep.service";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { randomUUID } from "crypto";
import { stat } from "fs";


@Injectable()
export class CityService{
    constructor(
    @InjectRepository(City) private readonly cityRepository: Repository<City>
    ){}

    async createCity(name:string, state: State):Promise<City>{
        const newCity = new City()
        newCity.name = name
        newCity.uuid = randomUUID()
        newCity.state = state
        return await this.cityRepository.save(newCity)
    }


    async findCityByName(name: string):Promise<City>{
        return await this.cityRepository.findOneByOrFail({name:name})
    }


}
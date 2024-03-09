import { Injectable } from "@nestjs/common";
import { Addresses } from "./entities/addresses.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { City } from "./entities/cities.entity";
import { State } from "./entities/state.entity";
import { CepService } from "src/cep/cep.service";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { randomUUID } from "crypto";
import { StateService } from "./state.service";
import { CityService } from "./cities.service";
import { CreateEstablishmentDto } from "src/establishment/dto/create-establishment.dto";


@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Addresses) private readonly addressesRepository: Repository<Addresses>,
        private readonly cepService: CepService,
        private readonly stateService: StateService,
        private readonly cityService: CityService
    ) { }

    async createAddress(dto: CreateEstablishmentDto): Promise<Addresses> {

        const add = await this.cepService.getAddressByCep(dto.postalCode)

        const newAddress = new Addresses()
        
        newAddress.state = await this.stateService.findStateByUf(add.uf)
        newAddress.city = await this.cityService.findCityByName(add.city)
        newAddress.uuid = randomUUID()

        newAddress.street = dto.street
        newAddress.houseNumber = dto.houseNumber

        return await this.addressesRepository.save(newAddress)
    }

}
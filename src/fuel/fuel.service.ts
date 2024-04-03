import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuel } from './entities/fuel.entity';
import { Repository } from 'typeorm';
import { FuelType } from './entities/fuel.type.entity';
import { EstablishmentService } from 'src/establishment/establishment.service';
import { CreateFuelDTO } from 'src/shared/fuel/dto/request/create-fuel.dto';

@Injectable()
export class FuelService {
    
    constructor(
        @InjectRepository(Fuel)
        private readonly fuelRepository: Repository<Fuel>,
        @InjectRepository(FuelType)
        private readonly fuelTypeRepository: Repository<FuelType>,
        private readonly establishmentService: EstablishmentService
      ) {}
      async create(dto:CreateFuelDTO,userID:number): Promise<Fuel>{
        const establishment = await this.establishmentService.findByUserId(userID)
        if (!establishment) {
            throw new NotFoundException("Estabelecimento não encontrado")
        }
        if (establishment.establishmentType.name !== "GAS_STATION") {
            throw new UnauthorizedException("Funcionalidade indisponível para esse tipo de estabelecimento")
        }
        const fuelType = await this.fuelTypeRepository.findOne({
            where: {name: dto.fuelType}
        })
        if (!fuelType) {
            throw new  NotFoundException({message: 'Tipo de combustível não encontrado'})
        }
        const fuel = new Fuel()
        fuel.fuelType = fuelType
        fuel.fuelTitle = dto.fuelTitle
        fuel.value = dto.value
        fuel.productStatus = dto.productStatus
        fuel.establishment = establishment
        return  await this.fuelRepository.save(fuel)
      }
      async update(userId: number, fuelId: number, dto: CreateFuelDTO):Promise<Fuel> {
        console.log(userId + " "  + fuelId + " " + dto);
        
        const establishment =  await this.establishmentService.findByUserId(userId)
        if (establishment.establishmentType.name !== "GAS_STATION") {
            throw new UnauthorizedException("Funcionalidade indisponível para esse tipo de estabelecimento")
        }
        const fuelType = await this.fuelTypeRepository.findOne({
            where: {name: dto.fuelType}
        })
        if (!fuelType) {
            throw new  NotFoundException({message: 'Tipo de combustível não encontrado'})
        }
        const fuel = establishment.fuels.find((it) => it.id === fuelId);
        if (!fuel) {
            throw new UnauthorizedException({ message: 'O estabelecimento não possui permissão para alterar esse combustível' });
        }
        fuel.fuelType = fuelType
        fuel.fuelTitle = dto.fuelTitle
        fuel.productStatus = dto.productStatus
        fuel.value = dto.value
        return  this.fuelRepository.save(fuel)

    }
    async getFuels(userId:number): Promise<Fuel[]>{
        const establishment =  await this.establishmentService.findByUserId(userId)
        if (!establishment) {
            throw new NotFoundException("Estabelecimento não encontrado")
        }
        if(establishment.establishmentType.name !== "GAS_STATION") {
            throw new UnauthorizedException("Funcionalidade indisponível para esse tipo de estabelecimento")
        }
        return await this.fuelRepository.find({where: {establishment: {user: {id: userId}}}})
    }
    
}
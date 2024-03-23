import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuel } from './entity/fuel.entity';
import { Repository } from 'typeorm';
import { FuelType } from './entity/fuel.type.entity';
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
      async create(dto:CreateFuelDTO,establishmentId:number,userID:number): Promise<Fuel>{
        const establishment = await this.establishmentService.findByEstablishment(establishmentId)
        if (!establishment) {
            throw new NotFoundException("Estabelecimento não encontrado")
        }
        if (establishment.user.id !== userID) {
            throw new UnauthorizedException({message: 'Estabelecimento informado não pertence ao usuario'})
        }
        const fuelType = await this.fuelTypeRepository.findOne({
            where: {name: dto.fuelType.name}
        })
        if (!fuelType) {
            throw new  NotFoundException({message: 'Tipo de combustível não encontrado'})
        }
        const fuel = new Fuel()
        fuel.fuelType = dto.fuelType
        fuel.fuelTitle = dto.fuelTitle
        fuel.value = dto.value
        fuel.productStatus = dto.productStatus
        fuel.establishment = establishment
        
        return await this.fuelRepository.save(fuel)
      }
      async update(userId: number, fuelId: number, establishmentId: number, dto: CreateFuelDTO):Promise<Fuel> {
        const establishment =  await this.establishmentService.findByEstablishment(establishmentId)
        if (!establishment) {
            throw new NotFoundException("Estabelecimento não encontrado")
        }
        const fuelType =  this.fuelTypeRepository.findOne({
            where: {name: dto.fuelType.name}
        })
        if (!fuelType) {
            throw new  NotFoundException({message: 'Tipo de combustível não encontrado'})
        }

        if (establishment.user.id !== userId) {
            throw new UnauthorizedException({message: 'Estabelecimento informado não pertence ao usuario'})
        }
        const fuel = establishment.fuels.find((it)=> it.id === fuelId)
        if (!fuel) {
            throw new UnauthorizedException({message: 'O estabelecimento não possui permissão para alterar esse combustível'})
        }
        fuel.fuelTitle = dto.fuelTitle
        fuel.productStatus = dto.productStatus
        fuel.value = dto.value
        return  this.fuelRepository.save(fuel)

    }
}
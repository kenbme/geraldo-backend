import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { Repository } from 'typeorm';
import { ComponentType } from './entities/component.type.entity';
import { CreateComponentsDto } from 'src/shared/components/dto/request/create-components';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { UUID } from 'crypto';

@Injectable()
export class ComponentsService {
    
    constructor(
        @InjectRepository(Component)
        private readonly componentRepository: Repository<Component>,
        @InjectRepository(ComponentType)
        private readonly componentTypeRepository: Repository<ComponentType>,
        private readonly vehicleService: VehicleService
    ) {}

    async create(dto: CreateComponentsDto) {
        const componentType = await this.componentTypeRepository.findOneByOrFail({name: dto.componentsType})
        const component = new Component()
        const vehicle = await this.vehicleService.getVehicle(dto.vehicleUuid)
        const DateCurrent = new Date() 

        if (await this.findByComponentInVehicle(componentType, vehicle.id)) {
            throw new BadRequestException({message:'Já existe esse componente cadastrado no veículo'})   
        }
        if (!this.ComponentExist(componentType)) {
            throw new BadRequestException({message:'Componente veicular não encontrado'})
        }
        if (dto.kilometersLastExnchange > vehicle.kilometers) {
            throw new BadRequestException({message:'Quilometragem da última troca não pode ser maior do que a atual'})
        }

        component.componentType = componentType
        component.kilometersLastExnchange = dto.kilometersLastExnchange
        component.dateLastExchange = dto.dateLastExchange
        component.maintenanceFrequency = DateCurrent.setMonth(DateCurrent.getMonth() + dto.maintenanceFrequency)
        component.vehicle = vehicle
        return this.componentRepository.save(component);
    }

    async findByComponentInVehicle(ComponentType: ComponentType,id:UUID) {
        const vehicle = await this.vehicleService.getVehicle(id)
        for (const component of vehicle.components) {
            if (component.componentType === ComponentType) {
                return true;
            }
        }
        return false

    }
    async ComponentExist(ComponentType: ComponentType) {
        return await this.componentTypeRepository.existsBy(ComponentType)
    }

}


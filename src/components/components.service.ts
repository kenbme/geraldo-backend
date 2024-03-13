import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { Repository } from 'typeorm';
import { ComponentType } from './entities/component.type.entity';
import { CreateComponentsDto } from 'src/shared/components/dto/request/create-components';

@Injectable()
export class ComponentsService {
    constructor(
        @InjectRepository(Component)
        private readonly componentRepository: Repository<Component>,
        @InjectRepository(ComponentType)
        private readonly componentTypeRepository: Repository<ComponentType>
    ) {}

    async create(dto: CreateComponentsDto) {
        const componentType = await this.componentTypeRepository.findOneByOrFail({name: dto.componentsType})
        const component = new Component()
        component.componentType = componentType
        component.kilometersLastExnchange = dto.kilometersLastExnchange
        component.dateLastExchange = dto.dateLastExchange
        component.maintenanceFrequency = dto.maintenanceFrequency
        return this.componentRepository.save(component);
    }
}


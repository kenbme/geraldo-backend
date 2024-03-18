import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Component} from './entities/component.entity'
import {Repository} from 'typeorm'
import {ComponentType} from './entities/component.type.entity'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {VehicleService} from '../vehicle/vehicle.service'
import {UUID} from 'crypto'
import {DriverService} from 'src/driver/driver.service'
import { UpdateComponentDto } from 'src/shared/component/dto/request/update-component.dto'

@Injectable()
export class ComponentService {
  driverService: DriverService
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(ComponentType)
    private readonly componentTypeRepository: Repository<ComponentType>,
    private readonly vehicleService: VehicleService
  ) {}

  async create(dto: CreateComponentDto, userId: UUID): Promise<Component> {
    const vehicle = await this.vehicleService.findById(dto.vehicleId)

    const isOwner = vehicle.drivers.some((it) => it.user.id === userId && it.isOwner)
    if (!isOwner) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }

    if (dto.kilometersLastExchange > vehicle.kilometers) {
      throw new BadRequestException({
        message: 'Quilometragem da última troca não pode ser maior do que a atual'
      })
    }

    const componentType = await this.componentTypeRepository.findOne({
      where: {name: dto.componentType}
    })
    if (!componentType) {
      throw new BadRequestException({message: 'Componente veicular não encontrado'})
    }

    const componentExistsInVehicle = vehicle.components.some(
      (it) => it.componentType.name === componentType.name
    )
    if (componentExistsInVehicle) {
      throw new BadRequestException({message: 'Já existe esse componente cadastrado no veículo'})
    }

    const component = new Component()
    component.componentType = componentType
    component.kilometersLastExchange = dto.kilometersLastExchange
    component.dateLastExchange = new Date(dto.dateLastExchange)
    component.maintenanceFrequency = dto.maintenanceFrequency
    component.vehicle = vehicle

    return await this.componentRepository.save(component)
  }

  async update(userId: UUID, componentId: UUID, dto: UpdateComponentDto): Promise<Component> {
    const vehicle = await this.vehicleService.findById(dto.vehicleId)
    
    const isOwner = vehicle.drivers.some((it) => it.user.id === userId && it.isOwner)
    if (!isOwner) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }

    const component = vehicle.components.find(
      (it) => it.componentType.id === componentId
    )
    if (!component) {
      throw new NotFoundException('Componente veicular não existe')
    }

    component.kilometersLastExchange = dto.kilometersLastExchange
    component.dateLastExchange = new Date(dto.dateLastExchange)
    component.maintenanceFrequency = dto.maintenanceFrequency

    return await this.componentRepository.save(component)
  }
}

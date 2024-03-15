import {BadRequestException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Component} from './entities/component.entity'
import {Repository} from 'typeorm'
import {ComponentType} from './entities/component.type.entity'
import {CreateComponentDto} from '../shared/component/dto/request/create-component'
import {VehicleService} from '../vehicle/vehicle.service'
import {UUID} from 'crypto'

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(ComponentType)
    private readonly componentTypeRepository: Repository<ComponentType>,
    private readonly vehicleService: VehicleService
  ) {}

  async create(dto: CreateComponentDto): Promise<Component> {
    // TODO deve verificar se user é dono desse carro
    const componentType = await this.componentTypeRepository.findOneByOrFail({
      name: dto.componentType
    })
    const component = new Component()
    const vehicle = await this.vehicleService.findById(dto.vehicleId)
    const currentDate = new Date()
    if (await this.componentExistsInVehicle(componentType, vehicle.id)) {
      throw new BadRequestException({message: 'Já existe esse componente cadastrado no veículo'})
    }
    if (!this.componentExists(componentType)) {
      throw new BadRequestException({message: 'Componente veicular não encontrado'})
    }
    if (dto.kilometersLastExnchange > vehicle.kilometers) {
      throw new BadRequestException({
        message: 'Quilometragem da última troca não pode ser maior do que a atual'
      })
    }
    component.componentType = componentType
    component.kilometersLastExnchange = dto.kilometersLastExnchange
    component.dateLastExchange = dto.dateLastExchange
    component.maintenanceFrequency = currentDate.setMonth(
      currentDate.getMonth() + dto.maintenanceFrequency
    )
    component.vehicle = vehicle
    return this.componentRepository.save(component)
  }

  async componentExistsInVehicle(componentType: ComponentType, id: UUID): Promise<boolean> {
    const vehicle = await this.vehicleService.findById(id)
    for (const component of vehicle.components) {
      if (component.componentType === componentType) {
        return true
      }
    }
    return false
  }

  async componentExists(ComponentType: ComponentType): Promise<boolean> {
    return await this.componentTypeRepository.existsBy(ComponentType)
  }
}

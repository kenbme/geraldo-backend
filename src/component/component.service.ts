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
    const vehicle = await this.vehicleService.findById(dto.vehicleId)
    if (await this.componentExistsInVehicle(componentType, vehicle.id)) {
      throw new BadRequestException({message: 'Já existe esse componente cadastrado no veículo'})
    }
    if (!this.componentExists(componentType)) {
      throw new BadRequestException({message: 'Componente veicular não encontrado'})
    }
    if (dto.kilometersLastExchange > vehicle.kilometers) {
      throw new BadRequestException({
        message: 'Quilometragem da última troca não pode ser maior do que a atual'
      })
    }
    if(dto.dateLastExchange > new Date()){
      throw new BadRequestException({
        message: 'Data da última troca não pode ser maior do que a atual'
      })
    }

    const component = new Component()
    component.componentType = componentType
    component.kilometersLastExnchange = dto.kilometersLastExchange
    component.dateLastExchange = dto.dateLastExchange
    component.maintenanceFrequency = dto.maintenanceFrequency
    component.vehicle = vehicle
    const createdComponent = this.componentRepository.save(component)

    return component
  }

  async componentExistsInVehicle(componentType: ComponentType, id: UUID): Promise<boolean> {
    const vehicle = await this.vehicleService.findById(id)
    if (vehicle && vehicle.components) {
      for (const component of vehicle.components) {
          if (component.componentType === componentType) {
              return true;
          }
      }
  }  
  return false;
  }

  async componentExists(ComponentType: ComponentType): Promise<boolean> {
    return await this.componentTypeRepository.existsBy(ComponentType)
  }
}

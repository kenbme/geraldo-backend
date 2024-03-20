import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Component} from './entities/component.entity'
import {Repository} from 'typeorm'
import {ComponentType} from './entities/component.type.entity'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {VehicleService} from '../vehicle/vehicle.service'
import {DriverService} from 'src/driver/driver.service'
import {UpdateComponentDto} from 'src/shared/component/dto/request/update-component.dto'
import { Vehicle } from 'src/vehicle/entities/vehicle.entity'

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

  async create(dto: CreateComponentDto, userId: number, vehicleId: number): Promise<Component> {
    const vehicle = await this.vehicleService.findById(vehicleId)

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

  async update(userId: number, vehicleId: number, componentId: number, dto: UpdateComponentDto): Promise<Component> {
    const vehicle = await this.vehicleService.findById(vehicleId)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }

    const component = vehicle.components.find((it) => it.id === componentId)
    if (!component) {
      throw new NotFoundException('Componente veicular não existe')
    }
    if(dto.kilometersLastExchange > component.kilometersLastExchange){
      throw new UnprocessableEntityException({message: 'Quilometragem da última troca não pode ser maior do que a atual'})
    }
    if (new Date(dto.dateLastExchange) < component.dateLastExchange) {
      throw new UnprocessableEntityException({message:'Data da ultima troca não pode ser menor do que a atual'})
    }
    component.kilometersLastExchange = dto.kilometersLastExchange
    component.dateLastExchange = new Date(dto.dateLastExchange)
    component.maintenanceFrequency = dto.maintenanceFrequency

    return await this.componentRepository.save(component)
  }

  async deleteComponent(userId: number, componentId: number): Promise<void> {
    const component = await this.componentRepository.findOne({where: {id: componentId}, relations : ["vehicle", "vehicle.drivers"]})
    if (!component) {
      throw new NotFoundException(`Componente veicular não existe`)
    }
    const isOwner = component.vehicle.drivers.some((it) => it.user.id === userId && it.isOwner)
    if (!isOwner) {
      throw new UnauthorizedException('Veículo informado não pertence ao motorista')
    }
    await this.componentRepository.remove(component)
  }

  async getVehicleComponents(userId: number, vehicleId: number): Promise<Component[]> {
    const vehicle = await this.vehicleService.findById(vehicleId)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException('Veículo informado não pertence ao motorista')
    }
    return vehicle.components
  }
}

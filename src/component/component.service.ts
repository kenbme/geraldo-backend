import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Component} from './entities/component.entity'
import {Repository} from 'typeorm'
import {ComponentType} from './entities/component.type.entity'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {VehicleService} from '../vehicle/vehicle.service'
import {UUID} from 'crypto'
import { Vehicle } from 'src/vehicle/entities/vehicle.entity'
import { DriverService } from 'src/driver/driver.service'

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

  async create(dto: CreateComponentDto,idDriver:UUID): Promise<Component> {
    const vehicle = await this.vehicleService.findById(dto.vehicleId)
    const componentType = await this.componentTypeRepository.findOneByOrFail({
      name: dto.componentType
    })
   //todo: necessario revisaão
   /* if (await !(this.isOwner(vehicle, idDriver))) {
      throw new UnauthorizedException({message:"Veículo informado não pertence ao motorista"})
    } */
    if (await this.componentExistsInVehicle(componentType, vehicle.id)) {
      throw new BadRequestException({message: 'Já existe esse componente cadastrado no veículo'})
    }
    if (await this.componentNotExists(componentType)) {
      throw new BadRequestException({message: 'Componente veicular não encontrado'})
    }
    if (dto.kilometersLastExchange > vehicle.kilometers) {
      throw new BadRequestException({
        message: 'Quilometragem da última troca não pode ser maior do que a atual'
      })
    }
    const component = new Component()
    component.componentType = componentType
    component.kilometersLastExnchange = dto.kilometersLastExchange
    component.dateLastExchange = new Date(dto.dateLastExchange)
    component.maintenanceFrequency =  dto.maintenanceFrequency
    component.vehicle = vehicle
    return await this.componentRepository.create(component)
  }

  async componentExistsInVehicle(componentType: ComponentType, id: UUID): Promise<boolean> {
    const vehicle = await this.vehicleService.findById(id)
    if (vehicle && vehicle.components) {
      for (let index = 0; index < vehicle.components.length; index++) {
        if (vehicle.components[index].componentType.name === componentType.name) {
          return true
        }
        
      }
  }  
  return false;
  }

  async componentNotExists(ComponentType: ComponentType): Promise<boolean> {
    return await !(this.componentTypeRepository.existsBy({name: ComponentType.name}))
  }

  /* async isOwner(vehicle: Vehicle, driverId: UUID): Promise<boolean> {
    const driver = await this.driverService.findById(driverId)
    console.log(driver)
    if (vehicle !== null) {
      if (vehicle.owners.includes(driver)) {
        return true
      }
    }
    return false
  }*/
}

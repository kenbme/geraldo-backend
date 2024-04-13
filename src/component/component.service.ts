import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Component} from './entities/component.entity'
import {LessThanOrEqual, Raw, Repository} from 'typeorm'
import {ComponentType} from './entities/component.type.entity'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {VehicleService} from '../vehicle/vehicle.service'
import {DriverService} from '../driver/driver.service'
import {UpdateComponentDto} from '../shared/component/dto/request/update-component.dto'

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

  async update(
    userId: number,
    vehicleId: number,
    componentId: number,
    dto: UpdateComponentDto
  ): Promise<Component> {
    const vehicle = await this.vehicleService.findById(vehicleId)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }

    const component = vehicle.components.find((it) => it.id === (componentId))
    if (!component) {
      throw new NotFoundException('Componente veicular não existe')
    }
    if (dto.kilometersLastExchange > component.kilometersLastExchange) {
      throw new UnprocessableEntityException({
        message: 'Quilometragem da última troca não pode ser maior do que a atual'
      })
    }
    if (new Date(dto.dateLastExchange) < component.dateLastExchange) {
      throw new UnprocessableEntityException({
        message: 'Data da ultima troca não pode ser menor do que a atual'
      })
    }
    component.kilometersLastExchange = dto.kilometersLastExchange
    component.dateLastExchange = new Date(dto.dateLastExchange)
    component.maintenanceFrequency = dto.maintenanceFrequency

    return await this.componentRepository.save(component)
  }

  async deleteComponent(userId: number, componentId: number): Promise<void> {
    const component = await this.componentRepository.findOne({
      where: {id: componentId},
      relations: ['vehicle', 'vehicle.drivers']
    })
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
  
  //RF15


  //Notificacao por kilometragem
  async notifyByKilometers(): Promise<void> {
    const maxKmBeforeMaintenance = 10000;
    let reasonToNotify = `\nPorque seu veiculo já rodou mais de ${maxKmBeforeMaintenance} km desde a ultima manutenção!`
    const components = await this.componentRepository.find({
      relations: ['vehicle']
    });

    for (const component of components) {
      const kilometersDifference = component.vehicle.kilometers - component.kilometersLastExchange;
      if (kilometersDifference >= maxKmBeforeMaintenance) {
        await this.notifyMaintenance(component, reasonToNotify);
      }
    }
  }

  //Notificaco por tempo limite
  async notifyByMaxTime(): Promise<void> {
    let reasonToNotify = "\nPorque ja se passou algum tempo desde a ultima troca do componente"
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const components = await this.componentRepository.find({
      where: {
        dateLastExchange: LessThanOrEqual(sixMonthsAgo),
      },
    });

    for (const component of components) {
      await this.notifyMaintenance(component, reasonToNotify);
    }
  }

  //Notificacao por configuracao do usuario
  async notifyByTime(): Promise<void> {
    let reasonToNotify = "\nPorque voce configurou um tempo para realizar as manutencoes "
    const components = await this.componentRepository.find({
      where: {
        dateLastExchange: LessThanOrEqual(Raw(alias => `${alias} + INTERVAL maintenanceFrequency MONTH <= CURRENT_DATE()`)),
      },
    });
    
    for (const component of components) {
      await this.notifyMaintenance(component, reasonToNotify);
    }
  }

  private async notifyMaintenance(component: Component, reasonToNotify : String) {
    let maintenanceMessage = `É hora de fazer a manutenção do seu componente ${component.componentType.name} (${component.id}) `;
    maintenanceMessage += reasonToNotify;
    console.log(maintenanceMessage);
    return maintenanceMessage;
  }



}

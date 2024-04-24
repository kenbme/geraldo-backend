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
import {DriverService} from '../driver/driver.service'
import {UpdateComponentDto} from '../shared/component/dto/request/update-component.dto'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ComponentHistory } from './entities/ComponentHistory.entity'

@Injectable()
export class ComponentService {
  driverService: DriverService
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(ComponentHistory)
    private readonly componentHistoryRepository: Repository<ComponentHistory>,
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

    const component = vehicle.components.find((it) => it.id === componentId)
    if (!component) {
      throw new NotFoundException('Componente veicular não existe')
    }
    const newDate = new Date(component.dateLastExchange)
    newDate.setDate(newDate.getDate() + 2)
    const componentHistory = new ComponentHistory()
    componentHistory.component = component
    componentHistory.dateLastExchange = newDate
    componentHistory.kilometersLastExchange = component.kilometersLastExchange
    componentHistory.maintenanceFrequency = component.maintenanceFrequency
    await this.componentHistoryRepository.save(componentHistory)

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

  async generateMonthlyReport() {
    const components = await this.componentRepository.find({ relations: ['vehicle'] });

    if (!components || components.length === 0) {
      const message = 'Olá, caro motorista! Notamos que você ainda não cadastrou os componentes do seu veículo.' +
          ' Cadastre-os e receba um relatório mensal detalhado sobre eles diretamente no seu e-mail.' +
          ' Isso ajudará você a manter seu veículo em ótimas condições. Obrigado!';

      // TODO enviar por email    
      console.log(message);
      return message;
  }

    let reportOutput = `Olá, caro motorista! O mês virou e seu relatório chegou!` +
    ` Aqui está a situação atual do(s) componente(s) do seu veículo:\n\n`;

    for (const component of components) {
      reportOutput += this.generateComponentReport(component);
   }

  reportOutput += "Obrigado, até o próximo!";

  // TODO enviar por email
  console.log(reportOutput);
  return reportOutput;
  }

  private generateComponentReport(component: Component) {
    const nextMaintenanceDate = new Date(component.dateLastExchange);
    nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + component.maintenanceFrequency);

    const fiveDaysClose = new Date();
    fiveDaysClose.setDate(fiveDaysClose.getDate() + 5);

    const isMaintenanceDue = (nextMaintenanceDate <= fiveDaysClose)
    const kilometersDriven = component.vehicle.kilometers - component.kilometersLastExchange;

    let maintenanceMessage = '';
    if (isMaintenanceDue) {
      maintenanceMessage = 'Precisa de manutenção';
    } else {
      maintenanceMessage = 'Não precisa de manutenção';
    }

    return `Tipo do Componente: ${component.componentType.name}
    ID do Componente: ${component.id}
    ID do Veículo: ${component.vehicle.id}
    Status de Manutenção: ${maintenanceMessage}
    Quilômetros Dirigidos: ${kilometersDriven}\n\n`;
}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  handleCron() {
    this.generateMonthlyReport();
  }
  async updateHistory(
    userId: number,
    vehicleId: number,
    componentId: number,
  ): Promise<ComponentHistory[]> {
    const vehicle = await this.vehicleService.findById(vehicleId)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }
    const component = vehicle.components.find((it) => it.id === componentId)
    if (!component) {
      const isComponent = await this.componentRepository.findOne({where: {id: componentId}})
      if (!isComponent) {
        throw new NotFoundException('Componente veicular não existe')
      }
      if (isComponent.vehicle.id !== vehicleId) {
        throw new UnauthorizedException({message: ' Não autorizado'})
      }
      throw new NotFoundException('Componente veicular não existe')
    }
    const history = await this.getUpdateHistoryByIdComponent(component)
    return history;
  }
  async getUpdateHistoryByIdComponent(component: Component): Promise<ComponentHistory[]> {
    const componentHistory = await this.componentHistoryRepository.find({
        where: {component: component},
    });
    if (!componentHistory) {
        throw new NotFoundException('Componente veicular não encontrado');
    }
    return componentHistory.reverse()
}
}

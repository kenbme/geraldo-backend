import {Test, TestingModule} from '@nestjs/testing'
import {ComponentController} from './component.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {Driver} from 'src/driver/entities/driver.entity'
import {Component} from './entities/component.entity'
import {Vehicle} from 'src/vehicle/entities/vehicle.entity'
import {ComponentService} from './component.service'
import {ComponentType} from './entities/component.type.entity'
import {VehicleModule} from 'src/vehicle/vehicle.module'
import {DriverModule} from 'src/driver/driver.module'
import {UserModule} from 'src/user/user.module'
import {ComponentTypeSeeder} from './seeders/component.type.seeder'
import {UserTypeSeeder} from 'src/user/seeders/user.type.seeder'
import {DriverService} from 'src/driver/driver.service'
import {VehicleService} from 'src/vehicle/vehicle.service'
import {ComponentTypeEnum} from 'src/shared/component/enums/component-type.enum'
import {ValidationError, validateOrReject} from 'class-validator'
import {CreateComponentDto} from 'src/shared/component/dto/request/create-component.dto'
import {UpdateComponentDto} from 'src/shared/component/dto/request/update-component.dto'
import {ComponentHistory} from './entities/ComponentHistory.entity'

describe('ComponentController', () => {
  let componentController: ComponentController
  let componentService: ComponentService
  let user: User
  let user2: User
  let vehicle: Vehicle

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_component.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Driver, Vehicle, Component, ComponentType, ComponentHistory]
        }),
        UserModule,
        DriverModule,
        VehicleModule,
        TypeOrmModule.forFeature([
          User,
          UserType,
          Driver,
          Vehicle,
          Component,
          ComponentType,
          ComponentHistory
        ])
      ],
      controllers: [ComponentController],
      providers: [ComponentService, ComponentTypeSeeder, UserTypeSeeder]
    }).compile()

    componentController = module.get(ComponentController)
    componentService = module.get(ComponentService)

    const seeder = module.get(ComponentTypeSeeder)
    await seeder.seed()

    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()
    const driverService = module.get(DriverService)
    user = await driverService.create({
      name: 'João',
      birthday: '2002-12-12',
      email: 'joao@gmail.com',
      username: '09400830009'
    })
    user2 = await driverService.create({
      name: 'Jo',
      birthday: '2001-12-12',
      email: 'jo@gmail.com',
      username: '19400830009'
    })
    const vehicleService = module.get(VehicleService)
    vehicle = await vehicleService.create(user.id, {
      kilometers: 500,
      year: 2022,
      model: 'Civic',
      plate: 'NET3818'
    })
  })

  it('should be defined', () => {
    expect(componentController).toBeDefined()
    expect(componentService).toBeDefined()
  })

  it('should create a component', async () => {
    await componentService.create(
      {
        componentType: ComponentTypeEnum.BALANCE,
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 50
      },
      user.id,
      vehicle.id
    )
  })
  it('Killometers greater than the current', async () => {
    try {
      const dto = await componentService.create(
        {
          componentType: ComponentTypeEnum.BALANCE,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 5000
        },
        user.id,
        vehicle.id
      )
      await validateOrReject(dto)
    } catch (error) {
      expect(error.message).toEqual(
        'Quilometragem da última troca não pode ser maior do que a atual'
      )
      return
    }
    throw new Error()
  })
  it('Date greater than the current', async () => {
    try {
      const dto = new CreateComponentDto()
      dto.componentType = ComponentTypeEnum.BALANCE
      dto.dateLastExchange = '2025-10-10'
      dto.maintenanceFrequency = 2
      dto.kilometersLastExchange = 50
      await validateOrReject(dto)
    } catch ([err]) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.isDateValid).toBe(
          'Data da última troca não pode ser maior do que a atual'
        )
        return
      }
    }
    throw new Error()
  })
  it('type of existing component', async () => {
    try {
      await componentService.create(
        {
          componentType: ComponentTypeEnum.BALANCE,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 50
        },
        user.id,
        vehicle.id
      )
      await componentService.create(
        {
          componentType: ComponentTypeEnum.BALANCE,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 50
        },
        user.id,
        vehicle.id
      )
    } catch (error) {
      expect(error.message).toEqual('Já existe esse componente cadastrado no veículo')
      return
    }
    throw new Error()
  })
  it('Driver not is owner', async () => {
    try {
      await componentService.create(
        {
          componentType: ComponentTypeEnum.BALANCE,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 500
        },
        user2.id,
        vehicle.id
      )
    } catch (error) {
      expect(error.message).toEqual('Veículo informado não pertence ao motorista')
      return
    }
    throw new Error()
  })
  it('should update a component', async () => {
    const component = componentService.create(
      {
        componentType: ComponentTypeEnum.BALANCE,
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 50
      },
      user.id,
      vehicle.id
    )
    await componentService.update(user.id, vehicle.id, (await component).id, {
      dateLastExchange: '2024-01-01',
      maintenanceFrequency: 3,
      kilometersLastExchange: 50
    })
  })
  it('should updateHistory a component', async () => {
    const component = componentService.create(
      {
        componentType: ComponentTypeEnum.BALANCE,
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 50
      },
      user.id,
      vehicle.id
    )
    await componentService.update(user.id, vehicle.id, (await component).id, {
      dateLastExchange: '2024-01-01',
      maintenanceFrequency: 3,
      kilometersLastExchange: 50
    })
    await componentService.update(user.id, vehicle.id, (await component).id, {
      dateLastExchange: '2024-04-02',
      maintenanceFrequency: 1,
      kilometersLastExchange: 50
    })
    console.log(await componentService.updateHistory(user.id, vehicle.id, (await component).id))
  })
  it('Driver not is owner for update', async () => {
    try {
      const componente = await componentService.create(
        {
          componentType: ComponentTypeEnum.AIR_FILTER,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 50
        },
        user.id,
        vehicle.id
      )
      await componentService.update(user2.id, vehicle.id, componente.id, {
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 500
      })
    } catch (error) {
      expect(error.message).toEqual('Veículo informado não pertence ao motorista')
      return
    }
    throw new Error()
  })
  it('Component not exists', async () => {
    try {
      await componentService.update(user.id, vehicle.id, 1234, {
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 500
      })
    } catch (error) {
      expect(error.message).toEqual('Componente veicular não existe')
      return
    }
    throw new Error()
  })
  it('Date greater than the current in update', async () => {
    try {
      const dto = new UpdateComponentDto()
      dto.dateLastExchange = '2025-10-10'
      dto.maintenanceFrequency = 2
      dto.kilometersLastExchange = 50
      await validateOrReject(dto)
    } catch ([err]) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.isDateValid).toBe(
          'Data da última troca não pode ser maior do que a atual'
        )
        return
      }
    }
    throw new Error()
  })
  it('Killometers greater than the current in update', async () => {
    try {
      const componente = await componentService.create(
        {
          componentType: ComponentTypeEnum.AIR_FILTER,
          dateLastExchange: '2023-10-10',
          maintenanceFrequency: 2,
          kilometersLastExchange: 5000
        },
        user.id,
        vehicle.id
      )
      await componentService.update(user.id, vehicle.id, componente.id, {
        dateLastExchange: '2023-10-10',
        maintenanceFrequency: 2,
        kilometersLastExchange: 5000
      })
    } catch (error) {
      expect(error.message).toEqual(
        'Quilometragem da última troca não pode ser maior do que a atual'
      )
      return
    }
    throw new Error()
  })

  it('should generate a report', async () => {
    const currentDate = new Date()
    currentDate.setDate(1)
    currentDate.setHours(12, 0, 0, 0)

    const lastExchange = new Date(currentDate)
    lastExchange.setMonth(currentDate.getMonth() - 1)
    lastExchange.setDate(currentDate.getDate() + 3)

    const component = await componentService.create(
      {
        componentType: ComponentTypeEnum.MOTOR_OIL,
        dateLastExchange: lastExchange.toISOString(),
        maintenanceFrequency: 1,
        kilometersLastExchange: 50
      },
      user.id,
      vehicle.id
    )
    const generatedReport = await componentService.generateMonthlyReport()

    expect(generatedReport).toBeDefined()
    expect(generatedReport).toContain('Olá, caro motorista')
    expect(generatedReport).toContain('O mês virou e seu relatório chegou!')
    expect(generatedReport).toContain('Tipo do Componente: ' + component.componentType.name)
    expect(generatedReport).toContain('ID do Componente: ' + component.id)
    expect(generatedReport).toContain('ID do Veículo: ' + component.vehicle.id)
    expect(generatedReport).toContain('Status de Manutenção: ' + 'Precisa de manutenção')
    expect(generatedReport).toContain(
      'Quilômetros Dirigidos: ' + (component.vehicle.kilometers - component.kilometersLastExchange)
    )
    expect(generatedReport).toContain('Obrigado, até o próximo!')
  })

  it('should generate a report with two components, but only one needing maintenance', async () => {
    const currentDate = new Date()
    currentDate.setDate(1)
    currentDate.setHours(12, 0, 0, 0)

    const lastExchange = new Date(currentDate)
    lastExchange.setMonth(currentDate.getMonth() - 2)
    lastExchange.setDate(currentDate.getDate() + 5)

    const airFilter = await componentService.create(
      {
        componentType: ComponentTypeEnum.AIR_FILTER,
        dateLastExchange: lastExchange.toISOString(),
        maintenanceFrequency: 2,
        kilometersLastExchange: 200
      },
      user.id,
      vehicle.id
    )
    const motorOil = await componentService.create(
      {
        componentType: ComponentTypeEnum.MOTOR_OIL,
        dateLastExchange: lastExchange.toISOString(),
        maintenanceFrequency: 3,
        kilometersLastExchange: 200
      },
      user.id,
      vehicle.id
    )

    const generatedReport = await componentService.generateMonthlyReport()
    expect(generatedReport).toBeDefined()

    expect(generatedReport).toContain('Olá, caro motorista')
    expect(generatedReport).toContain('O mês virou e seu relatório chegou!')
    expect(generatedReport).toContain('Tipo do Componente: ' + airFilter.componentType.name)
    expect(generatedReport).toContain('ID do Componente: ' + airFilter.id)
    expect(generatedReport).toContain('ID do Veículo: ' + airFilter.vehicle.id)
    expect(generatedReport).toContain('Status de Manutenção: ' + 'Precisa de manutenção')
    expect(generatedReport).toContain(
      'Quilômetros Dirigidos: ' + (airFilter.vehicle.kilometers - airFilter.kilometersLastExchange)
    )
    expect(generatedReport).toContain('Tipo do Componente: ' + motorOil.componentType.name)
    expect(generatedReport).toContain('ID do Componente: ' + motorOil.id)
    expect(generatedReport).toContain('ID do Veículo: ' + motorOil.vehicle.id)
    expect(generatedReport).toContain('Status de Manutenção: ' + 'Não precisa de manutenção')
    expect(generatedReport).toContain(
      'Quilômetros Dirigidos: ' + (motorOil.vehicle.kilometers - motorOil.kilometersLastExchange)
    )
    expect(generatedReport).toContain('Obrigado, até o próximo!')
  })

  it('should generate a default message when no components are registered', async () => {
    const currentDate = new Date()
    currentDate.setDate(1)
    currentDate.setHours(12, 0, 0, 0)

    const currentDateISOString = currentDate.toISOString()

    const generatedReport = await componentService.generateMonthlyReport()
    expect(generatedReport).toBeDefined()

    expect(generatedReport).toContain(
      'Olá, caro motorista! Notamos que você ainda não cadastrou os componentes do seu veículo.'
    )
    expect(generatedReport).toContain(
      'Cadastre-os e receba um relatório mensal detalhado sobre eles diretamente no seu e-mail.'
    )
    expect(generatedReport).toContain(
      'Isso ajudará você a manter seu veículo em ótimas condições. Obrigado!'
    )
  })
})

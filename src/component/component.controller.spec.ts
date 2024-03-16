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

describe('ComponentController', () => {
  let componentController: ComponentController
  let componentService: ComponentService
  let driver: Driver
  let vehicle: Vehicle

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_component.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Driver, Vehicle, Component, ComponentType]
        }),
        UserModule,
        DriverModule,
        VehicleModule,
        TypeOrmModule.forFeature([User, UserType, Driver, Vehicle, Component, ComponentType])
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
    driver = await driverService.create({
      name: 'João',
      birthday: '2002-12-12',
      email: 'joao@gmail.com',
      username: '09400830009'
    })
    const vehicleService = module.get(VehicleService)
    vehicle = await vehicleService.create({
      driverId: driver.id,
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
    // TODO necessário revisar
    const component = await componentController.create({
      vehicleId: vehicle.id,
      componentType: ComponentTypeEnum.BALANCE,
      dateLastExchange: new Date(),
      maintenanceFrequency: 2,
      kilometersLastExchange: 50
    })
  })
})

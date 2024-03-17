import {Test, TestingModule} from '@nestjs/testing'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserModule} from 'src/user/user.module'
import {Vehicle} from './entities/vehicle.entity'
import {VehicleController} from './vehicle.controller'
import {VehicleService} from './vehicle.service'
import {Component} from 'src/component/entities/component.entity'
import {ComponentType} from 'src/component/entities/component.type.entity'
import {User} from 'src/user/entities/user.entity'
import {Driver} from 'src/driver/entities/driver.entity'
import {DriverModule} from 'src/driver/driver.module'
import {UserType} from 'src/user/entities/user.type.entity'
import {DriverService} from 'src/driver/driver.service'
import {UserTypeSeeder} from 'src/user/seeders/user.type.seeder'
import {NotFoundException} from '@nestjs/common'

describe('VehicleController', () => {
  let vehicleController: VehicleController
  let vehicleService: VehicleService
  let driverService: DriverService
  let driver: Driver


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_vehicle.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Driver, Vehicle, Component, ComponentType]
        }),
        TypeOrmModule.forFeature([Vehicle, Driver, User, UserType]),
        UserModule,
        DriverModule
      ],
      controllers: [VehicleController],
      providers: [VehicleService, DriverService, UserTypeSeeder]
    }).compile()

    vehicleController = module.get<VehicleController>(VehicleController)
    vehicleService = module.get(VehicleService)
    driverService = module.get(DriverService)
    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()
    driver = await driverService.create({
      name: 'João',
      birthday: '2002-12-12',
      email: 'joao@gmail.com',
      username: '09400830009'
    })
  })

  it('should controller to be defined', () => {
    expect(vehicleController).toBeDefined()
    expect(driverService).toBeDefined()
  })

  it('should create a vehicle', async () => {
    await vehicleService.create({
      driverId: driver.id,
      kilometers: 502,
      year: 2023,
      model: 'Civic',
      plate: 'NEV3118'
    })
  })
  
  it('result get lists', async () => {
    const veiculo1 = await vehicleController.create({
      driverId: driver.id,
      kilometers: 500,
      year: 2022,
      model: 'Civic',
      plate: 'NET3818'
    })
    const veiculo2 = await vehicleController.create({
      driverId: driver.id,
      kilometers: 502,
      year: 2023,
      model: 'Civic',
      plate: 'NEV3118'
    })
    const vehicles = await vehicleController.getVehicles(driver.id)
    expect(vehicles).toEqual({"data": [{"id": veiculo1.data.id, "kilometers": 500, "model": "Civic", "plate": "NET3818", "year": 2022},
     {"id": veiculo2.data.id, "kilometers": 502, "model": "Civic", "plate": "NEV3118", "year": 2023}], "message": "Veículos encontrados"})
  })

  it('result get lists empty', async () => {
    const vehicles = await vehicleService.getVehicles(driver.id)
    expect(vehicles).toStrictEqual([])
  })

  it('result get lists driver not found', async () => {
    try {
      await vehicleService.getVehicles('606e374a-ca2f-4676-9adc-f31ef238288e')
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toEqual('Motorista não encontrado')
      return
    }
    throw new Error()
  })
})

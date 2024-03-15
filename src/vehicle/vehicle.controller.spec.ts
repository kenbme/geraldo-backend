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

describe('VehicleController', () => {
  let vehicleController: VehicleController
  let vehicleService: VehicleService

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
        TypeOrmModule.forFeature([Vehicle]),
        UserModule,
        DriverModule
      ],
      controllers: [VehicleController],
      providers: [VehicleService]
    }).compile()

    vehicleController = module.get<VehicleController>(VehicleController)
    vehicleService = module.get<VehicleService>(VehicleService)
  })

  it('should controller to be defined', () => {
    expect(vehicleController).toBeDefined()
    expect(vehicleService).toBeDefined()
  })
})

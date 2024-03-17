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
import { ShareVehicleDto } from 'src/shared/vehicle/dto/request/share-vehicle.dto'
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

describe('VehicleController', () => {
  let vehicleController: VehicleController
  let vehicleService: VehicleService
  let driverService: DriverService
  let driver: Driver
  let driver2: Driver

  dotenv.config({ path: '.development.env' });
  
  const generateJwtToken = (userId: string): string => {
    const secretKey = process.env.JWT_SECRET_KEY;
  
    if (!secretKey) {
      throw new Error('jwp token não definida na variável de ambiente');
    }
  
    const token = jwt.sign({ userId }, secretKey as jwt.Secret, { expiresIn: '1h' });
    return token;
  };

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
    driver2 = await driverService.create({
      name: 'Pedro',
      birthday: '2001-10-10',
      email: 'pedro@gmail.com',
      username: '81779020082'
  })
})

  it('should controller to be defined', () => {
    expect(vehicleController).toBeDefined()
    expect(driverService).toBeDefined()
  })

  it('should create a vehicle', async () => {
    await vehicleService.create({
      driverId: driver.id,
      kilometers: 500,
      year: 2022,
      model: 'Civic',
      plate: 'NET3818'
    })
  })

  it('should share a vehicle', async () => {
    const token = generateJwtToken(driver.id);

    const veiculo1 = await vehicleController.create({
      driverId: driver.id,
      kilometers: 500,
      year: 2022,
      model: 'Civic',
      plate: 'NET3818'
    })

    const req = {
      headers: {
        get: () => `Bearer ${token}`
      }
    } as any;
    
    const shareVehicleDto: ShareVehicleDto = {
      cpf: driver2.user.username
    }
    const result = await vehicleController.shareVehicle(req, veiculo1.data.id, shareVehicleDto)

    expect(result.message).toEqual('Veiculo compartilhado com sucesso')
  })
})
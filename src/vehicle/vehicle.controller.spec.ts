import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ValidationError, validateOrReject } from 'class-validator'
import { randomUUID } from 'crypto'
import { Component } from 'src/component/entities/component.entity'
import { ComponentType } from 'src/component/entities/component.type.entity'
import { DriverModule } from 'src/driver/driver.module'
import { DriverService } from 'src/driver/driver.service'
import { Driver } from 'src/driver/entities/driver.entity'
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { UserTypeSeeder } from 'src/user/seeders/user.type.seeder'
import { UserModule } from 'src/user/user.module'
import { Vehicle } from './entities/vehicle.entity'
import { VehicleController } from './vehicle.controller'
import { VehicleService } from './vehicle.service'

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
    const dto = new CreateVehicleDto()
    dto.driverId = driver.id,
    dto.kilometers = 500,
    dto.year = 2022,
    dto.model ='Civic',
    dto.plate ='NET3898'
    await validateOrReject(dto)
    vehicleService.create(dto)
  })
  
  it('The can t be igual to a year after the next year', async () => {
    try {
      const dto = new CreateVehicleDto();
      dto.driverId = driver.id
      dto.kilometers = 500
      dto.year = 2032
      dto.model = 'Civic'
      dto.plate = 'NET3118'
      await validateOrReject(dto)
      await vehicleService.create(dto)
    } catch (err) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.isValidYear).toBe('Ano inválido')
        return
      }
    }
  })

  it('The year need to be a integer', async () => {
    try {
      const dto = new CreateVehicleDto();
      dto.driverId = driver.id;
      dto.kilometers = 500;
      dto.year = 2022.12;
      dto.model = 'Onix';
      dto.plate = 'NET3818';
    await validateOrReject(dto);
    await vehicleService.create(dto);
  } catch (err) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.IsInt).toBe('O ano precisa ser um inteiro')
        return
      }
    }
  })

  it('The model cant be empty', async () => {
    try {
      const dto = new CreateVehicleDto()
      dto.driverId = driver.id
      dto.kilometers = 500
      dto.year = 2022
      dto.model = ''
      dto.plate = 'ADE8989'
      await validateOrReject(dto)
      await vehicleService.create(dto)
    } catch (err) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.isNotEmpty).toBe('O modelo não pode ser vazio')
        return;
      }
    }
  })
  
  it('The plate cant be empty', async () => {
    try {
      const dto = new CreateVehicleDto()
      dto.driverId = driver.id
      dto.kilometers = 500
      dto.year = 2022
      dto.model = 'Onix'
      dto.plate = ''
      await validateOrReject(dto)
      await vehicleService.create(dto)
    } catch (err) {
      if (err instanceof ValidationError && err.constraints) {
        expect(err.constraints.isNotEmpty).toBe('A placa não pode ser vazio')
        return;
      }
    }
  })
  it('The vehicle is already created', async () => {
    try{
      const dto = new CreateVehicleDto();
      dto.driverId = driver.id
      dto.kilometers = 500
      dto.year = 2022
      dto.model = 'Onix'
      dto.plate = 'NET3818'
      await validateOrReject(dto)
      await vehicleService.create(dto)
      const dto2 = new CreateVehicleDto()
      dto2.driverId = driver.id;
      dto2.kilometers = 500;
      dto2.year = 2022;
      dto2.model = 'Civic';
      dto2.plate = 'NET3818';
      await validateOrReject(dto2)
      await vehicleService.create(dto2)
    }catch (err) {
      if (err instanceof ConflictException) {
        expect(err.message).toBe('Veículo já encontra-se cadastrado')
        return;
      }
    }
  })

  it('The vehicle is already created by annother driver', async () => {
    try{
      const dto = new CreateVehicleDto();
      dto.driverId = driver.id
      dto.kilometers = 500
      dto.year = 2022
      dto.model = 'Onix'
      dto.plate = 'NET3818'
      await validateOrReject(dto)
      await vehicleService.create(dto)
      const dto2 = new CreateVehicleDto()
      dto2.driverId = randomUUID()
      dto2.kilometers = 500;
      dto2.year = 2022;
      dto2.model = 'Civic';
      dto2.plate = 'NET3818';
      await validateOrReject(dto2)
      await vehicleService.create(dto2)
    }catch (err) {
      if (err instanceof ConflictException) {
        expect(err.message).toBe('Veículo pertence a outro motorista')
        return;
      }
    }
  })
})

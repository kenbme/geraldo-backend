import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Address } from 'src/address/entities/address.entity'
import { City } from 'src/address/entities/cities.entity'
import { State } from 'src/address/entities/state.entity'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { FuelType } from 'src/fuel/entities/fuel.type.entity'
import { Schedule } from 'src/schedule/entities/schedule.entity'
import { Shift } from 'src/schedule/entities/shift.entity'
import { EstablishmentResponseDTO } from 'src/shared/establishment/dto/response/establishment.response.dto'
import { EstablishmentTypeEnum } from 'src/shared/establishment/enums/establishment-type.enum'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { Repository } from 'typeorm'

import { AddressModule } from 'src/address/address.module'
import { AddressService } from 'src/address/address.service'
import { CityService } from 'src/address/city.service'
import { StateSeeder } from 'src/address/seeders/state.seeder'
import { StateService } from 'src/address/state.service'
import { AvaliationService } from 'src/avaliation/avaliation.service'
import { Avaliation } from 'src/avaliation/entities/avaliation.entity'
import { CepModule } from 'src/cep/cep.module'
import { DriverModule } from 'src/driver/driver.module'
import { DriverService } from 'src/driver/driver.service'
import { Driver } from 'src/driver/entities/driver.entity'
import { Establishment } from 'src/establishment/entities/establishment.entity'
import { EstablishmentType } from 'src/establishment/entities/establishment.type.entity'
import { EstablishmentModule } from 'src/establishment/establishment.module'
import { EstablishmentService } from 'src/establishment/establishment.service'
import { EstablishmentTypeService } from 'src/establishment/establishment.type.service'
import { EstablishmentTypeSeeder } from 'src/establishment/seeders/establishment.type.seeder'
import { CreateScheduleDto } from 'src/shared/schedule/request/create-schedule.dto'
import { UserTypeSeeder } from 'src/user/seeders/user.type.seeder'
import { UserModule } from 'src/user/user.module'
import { ScheduleController } from './schedule.controller'
import { ScheduleModule } from './schedule.module'
import { ScheduleService } from './schedule.service'

describe('ScheduleController', () => {
  let scheduleController: ScheduleController
  let scheduleService: ScheduleService
  let userRepository: Repository<User>
  let establishmentFromController: {
    data: EstablishmentResponseDTO;
    message: string;
  }
  let establishmentFromService: Establishment
  let establishment: Establishment
  let establishment3: Establishment
  let establishment2: Establishment

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_schedule.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Establishment, Avaliation,Schedule,Shift, EstablishmentType, Address, State, City, Fuel, FuelType, Schedule, Shift]
        }),
        TypeOrmModule.forFeature([Schedule,Shift,Establishment, Driver,UserType, User, Address ,State,City,Fuel, FuelType, EstablishmentType, Schedule,Shift ,Avaliation]),
        UserModule,
        AddressModule,
        CepModule,
        DriverModule,
        EstablishmentModule,
        ScheduleModule
      ],
      controllers: [ScheduleController],
      providers: [
        EstablishmentService,
        AvaliationService,
        AddressService,
        CityService,
        StateService,
        EstablishmentTypeService,
        DriverService,
        EstablishmentTypeSeeder,
        StateSeeder,
        UserTypeSeeder,
        ScheduleService
      ]
    }).compile()
    scheduleController = module.get(ScheduleController)
    userRepository = module.get(getRepositoryToken(User))
    scheduleService = module.get(ScheduleService)
    const establishmentService = module.get(EstablishmentService)
    const driverService = module.get(DriverService)
    const establishmentTypeSeeder = module.get(EstablishmentTypeSeeder)
    await establishmentTypeSeeder.seed()
    const stateSeeder = module.get(StateSeeder)
    await stateSeeder.seed()
    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()
    await userRepository.clear()
    

    establishment = await establishmentService.create({
      username: "12345678000123",
      name: "Posto de Combustível XYZ",
      email: "postoxyz@example.com",
      establishmentType: EstablishmentTypeEnum.GAS_STATION,
      areaCode: "11",
      phone: "987654321",
      postalCode: "01153000",
      houseNumber: "123"
    })
    establishment2 = await establishmentService.create({
      username: "12345678220123",
      name: "Oficina do ze",
      email: "oficinaz@example.com",
      establishmentType: EstablishmentTypeEnum.WORKSHOP,
      areaCode: "11",
      phone: "987444321",
      postalCode: "58429170",
      houseNumber: "124"
    })
    establishment3 = await establishmentService.create({
      username: "21688336000169",
      name: "Posto de Combustível 3",
      email: "posto3@example.com",
      establishmentType: EstablishmentTypeEnum.GAS_STATION,
      areaCode: "11",
      phone: "987654321",
      postalCode: "01153000",
      houseNumber: "123"
    })
  })

  it('should be defined', () => {
    expect(scheduleController).toBeDefined()
    expect(scheduleService).toBeDefined()
  })

  it('should create a establishment', async () => {
    expect(establishment).toBeDefined()
    expect(establishment2).toBeDefined()
  })

  it('should create a establishment', async () => {
    const dto = new CreateScheduleDto
    dto.always_open = true
    dto.shifts = []
    const response = await scheduleService.create(dto,establishment.id)
    expect(response).toBeDefined()
  })

  it('should create a establishment', async () => {
    const dto = new CreateScheduleDto
    dto.always_open = false
    dto.shifts = [["13:45:30","13:46:30"]]
    const response = await scheduleService.create(dto,establishment.id)
    expect(response).toBeDefined()
  })

  it('should create a establishment', async () => {
    const dto = new CreateScheduleDto
    dto.always_open = false
    dto.shifts = [["13:45:30","13:46:30"],["14:45:30","14:46:30"],["15:45:30","15:46:30"]]
    const response = await scheduleService.create(dto,establishment.id)
    expect(response).toBeDefined()
  })

  it('should create a establishment', async () => {
    try{
      const dto = new CreateScheduleDto
      dto.always_open = false
      dto.shifts = [["13:45:30","13:46:30"],["14:45:30","14:46:30"],["15:45:30","15:45:20"]]
      const response = await scheduleService.create(dto,establishment.id)
    }catch(err){
      expect(err.message).toEqual('O horario do inicio de um turno precisam ser maiores que o do final')
    }
  })

})

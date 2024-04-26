import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Address } from 'src/address/entities/address.entity'
import { City } from 'src/address/entities/cities.entity'
import { State } from 'src/address/entities/state.entity'
import { EstablishmentModule } from 'src/establishment/establishment.module'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { FuelType } from 'src/fuel/entities/fuel.type.entity'
import { Schedule } from 'src/schedule/entities/schedule.entity'
import { Shift } from 'src/schedule/entities/shift.entity'
import { EstablishmentResponseDTO } from 'src/shared/establishment/dto/response/establishment.response.dto'
import { EstablishmentTypeEnum } from 'src/shared/establishment/enums/establishment-type.enum'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { UserModule } from 'src/user/user.module'
import { Repository } from 'typeorm'

import { Establishment } from 'src/establishment/entities/establishment.entity'
import { EstablishmentType } from 'src/establishment/entities/establishment.type.entity'
import { EstablishmentService } from 'src/establishment/establishment.service'
import { ScheduleController } from './schedule.controller'
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
          entities: [User, UserType, Establishment,Schedule,Shift, EstablishmentType, Address, State, City, Fuel, FuelType, Schedule, Shift]
        }),
        TypeOrmModule.forFeature([Establishment, EstablishmentType, State, UserType, User,Shift,Schedule]),
        UserModule,
        EstablishmentModule
      ],
      controllers: [ScheduleController],
      providers: [
        EstablishmentService,
        ScheduleService
      ]
    }).compile()
    scheduleController = module.get(ScheduleController)
    userRepository = module.get(getRepositoryToken(User))
    scheduleController = module.get(ScheduleService)
    const establishmentService = module.get(EstablishmentService)
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
    expect(establishmentFromController).toBeDefined()
    expect(establishmentFromService).toBeDefined()
  })

})

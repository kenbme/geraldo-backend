import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { EstablishmentModule } from 'src/establishment/establishment.module'
import { EstablishmentResponseDTO } from 'src/shared/establishment/dto/response/establishment.response.dto'
import { EstablishmentTypeEnum } from 'src/shared/establishment/enums/establishment-type.enum'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { UserModule } from 'src/user/user.module'
import { Repository } from 'typeorm'

import { AddressModule } from 'src/address/address.module'
import { AddressService } from 'src/address/address.service'
import { CityService } from 'src/address/city.service'
import { Address } from 'src/address/entities/address.entity'
import { City } from 'src/address/entities/cities.entity'
import { State } from 'src/address/entities/state.entity'
import { StateSeeder } from 'src/address/seeders/state.seeder'
import { StateService } from 'src/address/state.service'
import { CepModule } from 'src/cep/cep.module'
import { DriverModule } from 'src/driver/driver.module'
import { DriverService } from 'src/driver/driver.service'
import { Driver } from 'src/driver/entities/driver.entity'
import { Establishment } from 'src/establishment/entities/establishment.entity'
import { EstablishmentType } from 'src/establishment/entities/establishment.type.entity'
import { EstablishmentService } from 'src/establishment/establishment.service'
import { EstablishmentTypeService } from 'src/establishment/establishment.type.service'
import { EstablishmentTypeSeeder } from 'src/establishment/seeders/establishment.type.seeder'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { FuelType } from 'src/fuel/entities/fuel.type.entity'
import { Schedule } from 'src/schedule/entities/schedule.entity'
import { Shift } from 'src/schedule/entities/shift.entity'
import { CreateAvaliationDto } from 'src/shared/avaliation/dto/request/create_avaliation.dto'
import { UserTypeSeeder } from 'src/user/seeders/user.type.seeder'
import { AvaliationController } from './avaliation.controller'
import { AvaliationService } from './avaliation.service'
import { Avaliation } from './entities/avaliation.entity'


describe('ScheduleController', () => {
  let avaliationController: AvaliationController
  let avaliationService: AvaliationService
  let userRepository: Repository<User>
  let adressRepository: Repository<Address>
  let establishmentRepository: Repository<Establishment>
  let establishmentFromController: {
    data: EstablishmentResponseDTO;
    message: string;
  }
  let establishment: Establishment
  let establishment3: Establishment
  let establishment2: Establishment
  let user: User
  let user1: User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_avaliation.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Establishment,Address,State ,City, Fuel, FuelType, EstablishmentType, Schedule,Shift ,Avaliation]
        }),
        TypeOrmModule.forFeature([Establishment, Driver,UserType, User, Address ,State,City,Fuel, FuelType, EstablishmentType, Schedule,Shift ,Avaliation]),
        UserModule,
        AddressModule,
        CepModule,
        DriverModule,
        EstablishmentModule
      ],
      controllers: [AvaliationController],
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
        UserTypeSeeder
      ]
    }).compile()
    avaliationController = module.get(AvaliationController)
    userRepository = module.get(getRepositoryToken(User))
    avaliationService = module.get(AvaliationService)
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
    user = await driverService.create({
        name: 'João',
        birthday: '2002-12-12',
        email: 'joao@gmail.com',
        username: '09400830009'
      })
      user1 = await driverService.create({
        name: 'Jo',
        birthday: '2001-12-12',
        email: 'jo@gmail.com',
        username: '19400830009'
      })
  })

  it('should be defined', () => {
    expect(avaliationController).toBeDefined()
    expect(avaliationService).toBeDefined()
  })
  it('should be defined', () => {
    expect(establishment).toBeDefined()
    expect(establishment2).toBeDefined()
  })

  it('should create an avaliation', async() => {
    const dto = new CreateAvaliationDto
    dto.comment= "Otimo atendimento"
    dto.grade = 5
    dto.date = new Date('2004-01-23');
    await avaliationService.create(establishment.id,user.id,dto)
    const dto2 = new CreateAvaliationDto
    dto2.comment= "Otimo atendimento"
    dto2.grade = 0
    dto2.date = new Date('2004-01-25')
    await avaliationService.create(establishment.id,user.id,dto2)
  })

  it('the establishment doesnt exist', async() => {
    const dto = new CreateAvaliationDto
    dto.comment= "Ok atendimento"
    dto.grade = 4
    dto.date = new Date('2004-01-25')
    await avaliationService.create(establishment.id,user1.id,dto)
  })
})
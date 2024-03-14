import {Test, TestingModule} from '@nestjs/testing'
import {EstablishmentController} from './establishment.controller'
import {EstablishmentService} from './establishment.service'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {Establishment} from './entities/establishment.entity'
import {UserModule} from 'src/user/user.module'
import {EstablishmentType} from './entities/establishment.type.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import {Repository} from 'typeorm'
import {AddressesModule} from 'src/addresses/addresses.module'
import {Address} from 'src/addresses/entities/addresses.entity'
import {State} from 'src/addresses/entities/state.entity'
import {City} from 'src/addresses/entities/cities.entity'
import {EstablishmentTypeSeeder} from './seeders/establishment.type.seeder'
import {StateSeeder} from 'src/addresses/seeders/state.seeder'
import {UserTypeSeeder} from 'src/user/seeders/user.type.seeder'

describe('EstablishmentController', () => {
  let establishmentController: EstablishmentController
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_establishment.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Establishment, EstablishmentType, Address, State, City]
        }),
        TypeOrmModule.forFeature([Establishment, EstablishmentType, State, UserType]),
        UserModule,
        AddressesModule
      ],
      controllers: [EstablishmentController],
      providers: [
        EstablishmentService,
        EstablishmentTypeService,
        {provide: getRepositoryToken(User), useClass: Repository},
        EstablishmentTypeSeeder,
        StateSeeder,
        UserTypeSeeder
      ]
    }).compile()
    establishmentController = module.get(EstablishmentController)
    userRepository = module.get(getRepositoryToken(User))
    await userRepository.clear()
    const establishmentTypeSeeder = module.get(EstablishmentTypeSeeder)
    await establishmentTypeSeeder.seed()
    const stateSeeder = module.get(StateSeeder)
    await stateSeeder.seed()
    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()
  })

  it('should be defined', () => {
    expect(establishmentController).toBeDefined()
  })

  it('should create a establishment', async () => {
    const establishment = await establishmentController.create({
      username: '222.222.222-22',
      email: 'teste@gmail.com',
      name: 'fulano',
      areaCode: '83',
      phone: '83993333333',
      establishmentType: 'GAS_STATION',
      houseNumber: '15',
      postalCode: '58429900'
    })
    expect(establishment).toBeDefined()
  })
})

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
          entities: [User, UserType, Establishment, EstablishmentType]
        }),
        TypeOrmModule.forFeature([Establishment, EstablishmentType]),
        UserModule
      ],
      controllers: [EstablishmentController],
      providers: [
        EstablishmentService,
        EstablishmentTypeService,
        {provide: getRepositoryToken(User), useClass: Repository}
      ]
    }).compile()
    establishmentController = module.get(EstablishmentController)
    userRepository = module.get(getRepositoryToken(User))
    await userRepository.clear()
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
      postalCode: '58429-900'
    })
    expect(establishment).toBeDefined()
  })
})

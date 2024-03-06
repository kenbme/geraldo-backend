import {Test, TestingModule} from '@nestjs/testing'
import {EstablishmentController} from './establishment.controller'
import {EstablishmentService} from './establishment.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {Establishment} from './entities/establishment.entity'
import {UserModule} from 'src/user/user.module'
import {EstablishmentType} from './entities/establishment.type.entity'
import {EstablishmentTypeService} from './establishment.type.service'

describe('EstablishmentController', () => {
  let controller: EstablishmentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing.sqlite3',
          synchronize: true,
          entities: [User, UserType, Establishment, EstablishmentType]
        }),
        TypeOrmModule.forFeature([Establishment, EstablishmentType]),
        UserModule
      ],
      controllers: [EstablishmentController],
      providers: [EstablishmentService, EstablishmentTypeService]
    }).compile()

    controller = module.get<EstablishmentController>(EstablishmentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

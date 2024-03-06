import {Test, TestingModule} from '@nestjs/testing'
import {AuthController} from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db/testing.sqlite3',
        synchronize: true,
        entities: [User, UserType]
      }), UserModule],
      controllers: [],
      providers: []
    }).compile()

    //controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    //expect(controller).toBeDefined()
  })
})

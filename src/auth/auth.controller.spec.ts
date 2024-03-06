import {Test, TestingModule} from '@nestjs/testing'
import {AuthController} from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { User } from 'src/user/entities/user.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db/testing.sqlite3',
        synchronize: true,
        entities: [User, UserType]
      }), JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '60s'}
      }), UserModule],
      controllers: [AuthController],
      providers: [AuthService]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

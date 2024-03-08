import {Test, TestingModule} from '@nestjs/testing'
import {AuthController} from './auth.controller'
import {UserModule} from 'src/user/user.module'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {AuthService} from './auth.service'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {JwtModule} from '@nestjs/jwt'
import {Repository} from 'typeorm'
import {UserService} from 'src/user/user.service'
import {validateOrReject} from 'class-validator'
import {LoginDTO} from './dto/login.dto'
import { configDotenv } from 'dotenv'
import { resolve } from 'path'

describe('AuthController', () => {
  let authController: AuthController
  let userRepository: Repository<User>
  let userService: UserService

  beforeEach(async () => {
  configDotenv({path: resolve(process.cwd(), '.development.env')})
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/auth_testing.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType]
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET_KEY,
          signOptions: {expiresIn: '60s'}
        }),
        UserModule
      ],
      controllers: [AuthController],
      providers: [AuthService, {provide: getRepositoryToken(User), useClass: Repository}]
    }).compile()

    authController = module.get(AuthController)
    userService = module.get(UserService)
    userRepository = module.get(getRepositoryToken(User))
    await userRepository.clear()

    await userService.create({
      username: '11111111111',
      email: 'teste22@gmail.com',
      birthday: '1999-12-25',
      name: 'Sicrano',
      userType: 'DRIVER'
    })
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
    expect(userService).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should create user and login', async () => {
    const count = await userRepository.count()
    const data = await userService.create({
      username: '22222222222',
      email: 'teste@gmail.com',
      birthday: '2002-12-24',
      name: 'fulano',
      userType: 'DRIVER'
    })
    const newCount = await userRepository.count()
    expect(newCount).toBe(count + 1)
    expect(data.createdUser.name).toBe('fulano')

    const token = await authController.login({
      username: '22222222222',
      password: data.randomPassword
    })
    expect(token).toBeDefined()
  })

  it('it should reject invalid Document', async () => {
    try {
      const dto = new LoginDTO()
      dto.username = '12322'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })

  it('it should accept CPF', async () => {
    const dto = new LoginDTO()
    dto.username = '69158251006'
    dto.password = 'senhablablabla2232!'
    await validateOrReject(dto)
  })

  it('it should accept CNPJ', async () => {
    const dto = new LoginDTO()
    dto.username = '28212197000141'
    dto.password = 'umaSenhaQualquer32!'
    await validateOrReject(dto)
  })
})

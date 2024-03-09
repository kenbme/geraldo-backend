import {JwtModule} from '@nestjs/jwt'
import {Test, TestingModule} from '@nestjs/testing'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {validateOrReject} from 'class-validator'
import {configDotenv} from 'dotenv'
import {resolve} from 'path'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {UserModule} from 'src/user/user.module'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {LoginRequestDTO} from 'src/shared/auth/dto/request/login.request.dto'

configDotenv({path: resolve(process.cwd(), '.development.env')})

describe('AuthController', () => {
  let authController: AuthController
  let userRepository: Repository<User>
  let userService: UserService

  beforeEach(async () => {
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
      const dto = new LoginRequestDTO()
      dto.username = '12322'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })

  it('it should accept CPF', async () => {
    const dto = new LoginRequestDTO()
    dto.username = '69158251006'
    dto.password = 'senhablablabla2232!'
    await validateOrReject(dto)
  })

  it('it should accept CNPJ', async () => {
    const dto = new LoginRequestDTO()
    dto.username = '28212197000141'
    dto.password = 'umaSenhaQualquer32!'
    await validateOrReject(dto)
  })

  it('it should reject invalid CNPJ', async () => {
    try {
      const dto = new LoginRequestDTO()
      dto.username = '28212197000140'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })

  it('it should reject invalid CNPJ', async () => {
    try {
      const dto = new LoginRequestDTO()
      dto.username = '00000000000000'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })

  it('it should reject invalid CPF', async () => {
    try {
      const dto = new LoginRequestDTO()
      dto.username = '11137419430'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })

  it('it should accept CPF', async () => {
    const dto = new LoginRequestDTO()
    dto.username = '10137419430'
    dto.password = 'senhablablabla2232!'
    await validateOrReject(dto)
  })

  it('it should reject invalid CPF', async () => {
    try {
      const dto = new LoginRequestDTO()
      dto.username = '00000000000'
      dto.password = '1233214214'
      await validateOrReject(dto)
    } catch (err) {
      return
    }
    throw new Error()
  })
})

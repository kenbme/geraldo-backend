import {Test, TestingModule} from '@nestjs/testing'
import {AuthController} from './auth.controller'
import {UserModule} from 'src/user/user.module'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {AuthService} from './auth.service'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {JwtModule} from '@nestjs/jwt'
import {jwtConstants} from './constants'
import {Repository} from 'typeorm'
import {UserService} from 'src/user/user.service'

describe('AuthController', () => {
  let authController: AuthController
  let userRepository: Repository<User>
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing.sqlite3',
          synchronize: true,
          entities: [User, UserType]
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
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
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
    expect(userService).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should create user and login', async () => {
    const count = await userRepository.count()
    const user = await userService.create({
      username: '222.222.222-22',
      password: 'senhaDificil123!',
      email: 'teste@gmail.com',
      birthday: '2002-12-12',
      name: 'fulano',
      userType: 'DRIVER'
    })
    const newCount = await userRepository.count()
    expect(newCount).toBe(count + 1)
    expect(user.name).toBe('fulano')

    const token = await authController.signIn({
      username: '222.222.222-22',
      password: 'senhaDificil123!'
    })
    expect(token).toBeDefined()
  })
})

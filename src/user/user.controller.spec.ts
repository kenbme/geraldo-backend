import {Test, TestingModule} from '@nestjs/testing'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {validateOrReject} from 'class-validator'
import {Repository} from 'typeorm'
import {RecoverPasswordDto} from 'src/shared/user/dto/request/recover-password.dto'
import {User} from './entities/user.entity'
import {UserType} from './entities/user.type.entity'
import {UserController} from './user.controller'
import {UserModule} from './user.module'
import {UserService} from './user.service'
import {UserTypeService} from './user.type.service'

describe('UserController', () => {
  let userController: UserController
  let userRepository: Repository<User>
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_establishment.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType]
        }),
        TypeOrmModule.forFeature([User, UserType]),
        UserModule
      ],
      controllers: [UserController],
      providers: [
        UserService,
        UserTypeService,
        {provide: getRepositoryToken(User), useClass: Repository}
      ]
    }).compile()

    userController = module.get(UserController)
    userService = module.get(UserService)
    userRepository = module.get(getRepositoryToken(User))
    await userRepository.clear()
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  it('should create a user and change his password', async () => {
    const data = await userService.create({
      username: '10137419430',
      email: 'teste@gmail.com',
      birthday: '2000-09-10',
      name: 'fulano',
      userType: 'DRIVER'
    })
    expect(data).toBeDefined()
    const oldPassword = data.createdUser.password
    await userController.recoverPassword({email: 'teste@gmail.com'})
    const updatedUser = await userService.findByUsername('10137419430')
    expect(updatedUser.password).not.toEqual(oldPassword)
  })

  it('should not recover password if email is blank', async () => {
    try {
      const dto = new RecoverPasswordDto()
      dto.email = '       '
      await validateOrReject(dto)
    } catch ([err]) {
      expect(err.constraints.isEmail).toEqual('Formato inválido')
      return
    }
    throw new Error()
  })

  it('should not recover password if email is invalid', async () => {
    try {
      const dto = new RecoverPasswordDto()
      dto.email = 'asdasd'
      await validateOrReject(dto)
    } catch ([err]) {
      expect(err.constraints.isEmail).toEqual('Formato inválido')
      return
    }
    throw new Error()
  })

  it('should not recover password if email does not exist', async () => {
    try {
      await userController.recoverPassword({email: 'emailnaoexistente@gmail.com'})
    } catch (error) {
      expect(error.message).toEqual('Usuário Inválido')
      return
    }
    throw new Error()
  })
})

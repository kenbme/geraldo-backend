import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from './entities/user.type.entity';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserTypeService } from './user.type.service';

describe('UserController', () => {
  let userController: UserController;
  let userRepository: Repository<User>

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
    }).compile();

    userController = module.get<UserController>(UserController);
    userRepository = module.get(getRepositoryToken(User))
    await userRepository.clear()
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create a user and change his password', async () => {
    const user = await userController.create({
      username: 'user-generico',
      password: 'usersenha321',
      email: 'teste@gmail.com',
      birthday: '2000-09-10',
      name: 'fulano',
      userType: 'DRIVER'
    })

    expect(user).toBeDefined()

    const recoverPasswordDto = {
      email: 'teste@gmail.com',
    };
  
    await userController.recoverPassword(recoverPasswordDto, { status: () => ({ send: () => null }) });
  
    const updatedUser = await userController.findByUsername('user-generico');
    expect(updatedUser.password).not.toEqual('usersenha321');
  })

  it('should not recover password if email is empty', async () => {
    const user = await userController.create({
      username: 'user-generico',
      password: 'usersenha321',
      email: 'teste@gmail.com',
      birthday: '2000-09-10',
      name: 'fulano',
      userType: 'DRIVER'
    })

    expect(user).toBeDefined()

    const recoverPasswordDto = {
      email: '',
    };
  
    try {
      await userController.recoverPassword(recoverPasswordDto, { status: () => ({ send: () => null }) });
    } catch (error) {
      expect(error.message).toEqual('Campo Obrigatório');
    }
})

it('should not recover password if email does not exist', async () => {
  const user = await userController.create({
    username: 'user-generico',
    password: 'usersenha321',
    email: 'teste@gmail.com',
    birthday: '2000-09-10',
    name: 'fulano',
    userType: 'DRIVER'
  })

  expect(user).toBeDefined()

  const recoverPasswordDto = {
    email: 'emailnaoexistente@gmail.com',
  };

  try {
    await userController.recoverPassword(recoverPasswordDto, { status: () => ({ send: () => null }) });
  } catch (error) {
    expect(error.message).toEqual('Usuário ou email incorretos');
  }
})

});

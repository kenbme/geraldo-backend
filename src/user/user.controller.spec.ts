import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

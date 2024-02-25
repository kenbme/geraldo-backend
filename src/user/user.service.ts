import {Injectable} from '@nestjs/common'
import {CreateUserDto} from './dto/create-user.dto'
import {UpdateUserDto} from './dto/update-user.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {Repository} from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User()
    newUser.name = createUserDto.name
    newUser.email = createUserDto.email
    newUser.role = createUserDto.role
    newUser.password = '123' // TODO GERAR SENHA
    return await this.userRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne(userId: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({id: userId})
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const existingUser = await this.userRepository.findOneByOrFail({
      id: userId
    })
    existingUser.email = updateUserDto.email ?? existingUser.email
    existingUser.name = updateUserDto.name ?? existingUser.name
    existingUser.password =
      updateUserDto.password ?? existingUser.password
    return await this.userRepository.save(existingUser)
  }

  async remove(userId: number): Promise<void> {
    const existingUser = await this.userRepository.findOneByOrFail({
      id: userId
    })
    await this.userRepository.delete(existingUser)
  }
}

import {ConflictException, Injectable} from '@nestjs/common'
import {CreateUserDto} from './dto/create-user.dto'
import {UpdateUserDto} from './dto/update-user.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {Repository} from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email
    })
    if (existingUser) {
      throw new ConflictException('Email already exists')
    }
    const newUser = new User()
    newUser.name = createUserDto.name
    newUser.email = createUserDto.email
    newUser.role = createUserDto.role
    // TODO randomPassword deve ser enviada para email
    const randomPassword = Math.random().toString().split('0.')[1]
    console.log(randomPassword)
    newUser.password = await bcrypt.hash(randomPassword, 10)
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
    if (updateUserDto.password) {
      existingUser.password = await bcrypt.hash(
        updateUserDto.password,
        10
      )
    }
    return await this.userRepository.save(existingUser)
  }

  async remove(userId: number): Promise<void> {
    const existingUser = await this.userRepository.findOneByOrFail({
      id: userId
    })
    await this.userRepository.delete(existingUser)
  }
}

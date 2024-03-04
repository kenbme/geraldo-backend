import {ConflictException, Injectable} from '@nestjs/common'
import {CreateUserDto} from './dto/create-user.dto'
import {UpdateUserDto} from './dto/update-user.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {Repository} from 'typeorm'
import {hash} from 'bcrypt'
import {randomUUID} from 'crypto'
import {UserTypeService} from './user.type.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userTypeService: UserTypeService
  ) {}

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({email: email})
    return user !== null
  }

  private async usernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({username: username})
    return user !== null
  }

  private async encryptPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.usernameExists(createUserDto.username)) {
      throw new ConflictException('CPF or CNPJ already exists')
    }
    if (await this.emailExists(createUserDto.email)) {
      throw new ConflictException('Email already exists')
    }
    const newUser = new User()
    newUser.uuid = randomUUID()
    newUser.username = createUserDto.username
    // TODO randomPassword deve ser enviada para email
    const randomPassword = Math.random().toString().split('0.')[1]
    console.log(randomPassword)
    newUser.password = await this.encryptPassword(createUserDto.password)
    newUser.name = createUserDto.name
    newUser.email = createUserDto.email
    newUser.birthday = new Date(createUserDto.birthday)
    newUser.userType = await this.userTypeService.findByName(createUserDto.userType)
    return await this.userRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne(userId: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({id: userId})
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.username && (await this.usernameExists(updateUserDto.username))) {
      throw new ConflictException('CPF or CNPJ already exists')
    }
    if (updateUserDto.email && (await this.emailExists(updateUserDto.email))) {
      throw new ConflictException('Email already exists')
    }
    const existingUser = await this.userRepository.findOneByOrFail({id: userId})
    existingUser.username = updateUserDto.username ?? existingUser.username
    if (updateUserDto.password) {
      existingUser.password = await this.encryptPassword(updateUserDto.password)
    }
    existingUser.name = updateUserDto.name ?? existingUser.name
    existingUser.email = updateUserDto.email ?? existingUser.email
    existingUser.birthday = updateUserDto.birthday ?? existingUser.birthday
    return await this.userRepository.save(existingUser)
  }

  async remove(userId: number): Promise<void> {
    const existingUser = await this.userRepository.findOneByOrFail({id: userId})
    await this.userRepository.delete(existingUser)
  }
}

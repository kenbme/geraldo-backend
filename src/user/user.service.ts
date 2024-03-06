import {ConflictException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {hash} from 'bcrypt'
import {randomUUID} from 'crypto'
import {Repository} from 'typeorm'
import {CreateUserDto} from './dto/create-user.dto'
import {User} from './entities/user.entity'
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

  async findByUsername(userUsername: string): Promise<User> {
    return await this.userRepository.findOneByOrFail({username: userUsername})
  }
}

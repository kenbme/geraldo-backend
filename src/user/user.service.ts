import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {hash} from 'bcrypt'
import {randomUUID} from 'crypto'
import {Repository} from 'typeorm'
import {CreateUserDto} from 'src/shared/user/dto/request/create-user.dto'
import {User} from './entities/user.entity'
import {UserTypeService} from './user.type.service'
import {RecoverPasswordDto} from 'src/shared/user/dto/request/recover-password.dto'

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

  async create(createUserDto: CreateUserDto): Promise<{createdUser: User; randomPassword: string}> {
    if (await this.usernameExists(createUserDto.username)) {
      throw new ConflictException('Usuário já cadastrado')
    }
    if (await this.emailExists(createUserDto.email)) {
      throw new ConflictException('Email já cadastrado')
    }
    const newUser = new User()
    newUser.uuid = randomUUID()
    newUser.username = createUserDto.username
    // TODO randomPassword deve ser enviada para email
    const randomPassword = Math.random().toString().split('0.')[1]
    newUser.password = await this.encryptPassword(randomPassword)
    console.log(randomPassword)
    newUser.name = createUserDto.name
    newUser.email = createUserDto.email
    if (createUserDto.birthday) {
      newUser.birthday = new Date(createUserDto.birthday)
    }
    newUser.userType = await this.userTypeService.findByName(createUserDto.userType)
    const createdUser = await this.userRepository.save(newUser)
    return {createdUser, randomPassword}
  }

  async findByUsername(userUsername: string): Promise<User> {
    return await this.userRepository.findOneByOrFail({username: userUsername})
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDto): Promise<string> {
    const user = await this.userRepository.findOneBy({email: recoverPasswordDto.email})
    if (!user) {
      throw new BadRequestException('Usuário Inválido')
    }
    // TODO randomPassword deve ser enviada para email
    const randomPassword = Math.random().toString().split('0.')[1]
    console.log(randomPassword)
    user.password = await this.encryptPassword(randomPassword)
    user.resetPassword = true
    await this.userRepository.save(user)
    return randomPassword
  }
}

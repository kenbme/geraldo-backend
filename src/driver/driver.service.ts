import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { UserService } from '../user/user.service'
import { Repository } from 'typeorm'
import { CreateDriverDto } from '../shared/driver/dto/request/create-driver.dto'
import { Driver } from './entities/driver.entity'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class DriverService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) { }

  async create(createDriverDto: CreateDriverDto): Promise<User> {
    const { createdUser } = await this.userService.create({
      birthday: createDriverDto.birthday,
      email: createDriverDto.email,
      name: createDriverDto.name,
      username: createDriverDto.username,
      userType: UserTypeEnum.DRIVER
    })
    return createdUser
  }

  async findByUserId(userId: UUID): Promise<Driver[]> {
    return await this.driverRepository.find({ where: { user: { id: userId } } })
  }

  async findByUserName(username: string): Promise<Driver[]> {
    return await this.driverRepository.find({ where: { user: { username: username } } });
  }

}

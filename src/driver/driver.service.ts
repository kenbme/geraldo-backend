import {Injectable} from '@nestjs/common'
import {CreateDriverDto} from './dto/create-driver.dto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {Driver} from './entities/driver.entity'
import {randomUUID} from 'crypto'
import {InjectRepository} from '@nestjs/typeorm'

@Injectable()
export class DriverService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const user = await this.userService.create({
      birthday: createDriverDto.birthday,
      email: createDriverDto.email,
      name: createDriverDto.name,
      password: createDriverDto.password,
      username: createDriverDto.username,
      userType: 'DRIVER'
    })
    const driver = new Driver()
    driver.uuid = randomUUID()
    driver.user = user
    return this.driverRepository.save(driver)
  }
}

import {Injectable} from '@nestjs/common'
import {CreateDriverDto} from './dto/create-driver.dto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {Driver} from './entities/driver.entity'
import {randomUUID} from 'crypto'

@Injectable()
export class DriverService {
  constructor(
    private readonly userService: UserService,
    private readonly driverRepository: Repository<Driver>
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const user = await this.userService.create(createDriverDto)
    const driver = new Driver()
    driver.uuid = randomUUID()
    driver.user = user
    return this.driverRepository.save(driver)
  }
}

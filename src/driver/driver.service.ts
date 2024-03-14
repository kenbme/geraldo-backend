import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UUID} from 'crypto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'
import {Driver} from './entities/driver.entity'

@Injectable()
export class DriverService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const data = await this.userService.create({
      birthday: createDriverDto.birthday,
      email: createDriverDto.email,
      name: createDriverDto.name,
      username: createDriverDto.username,
      userType: 'DRIVER'
    })
    const driver = new Driver()
    driver.user = data.createdUser
    return this.driverRepository.save(driver)
  }

  async findById(driverId: UUID): Promise<Driver> {
    return await this.driverRepository.findOneByOrFail({id: driverId})
  }
}

import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UUID} from 'crypto'
import {UserService} from '../user/user.service'
import {Repository} from 'typeorm'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'
import {Driver} from './entities/driver.entity'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'

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
      userType: UserTypeEnum.DRIVER
    })
    const driver = new Driver()
    driver.user = data.createdUser
    return this.driverRepository.save(driver)
  }

  async findById(driverId: UUID): Promise<Driver> {
    const driver = await this.driverRepository.findOne({where:{id: driverId}})
    if (!driver) {
      throw new NotFoundException("Motorista não encontrado")
    }
    return driver;
  }

  async findByUserName(username: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { user: { username: username } } });
    if (!driver) {
      throw new NotFoundException("Motorista não encontrado")
    }
    return driver;
  }  
  
}

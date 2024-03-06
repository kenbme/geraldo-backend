import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UserType} from './entities/user.type.entity'
import {Repository} from 'typeorm'
import {randomUUID} from 'crypto'

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>
  ) {}

  private created = false

  async findByName(name: string): Promise<UserType> {
    if (!this.created) {
      await this.createTypes()
    }
    return this.userTypeRepository.findOneByOrFail({name: name})
  }

  private async createTypes(): Promise<void> {
    const driverType = new UserType()
    driverType.uuid = randomUUID()
    driverType.name = 'DRIVER'
    driverType.description = 'descricao de driver'

    const establishmentType = new UserType()
    establishmentType.uuid = randomUUID()
    establishmentType.name = 'ESTABLISHMENT'
    establishmentType.description = 'descricao de establishment'

    if (!(await this.userTypeRepository.existsBy({name: driverType.name}))) {
      await this.userTypeRepository.save(driverType)
    }
    if (!(await this.userTypeRepository.existsBy({name: establishmentType.name}))) {
      await this.userTypeRepository.save(establishmentType)
    }

    this.created = true
  }
}

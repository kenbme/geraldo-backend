import {Injectable} from '@nestjs/common'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {randomUUID} from 'crypto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentTypeService} from './establishment.type.service'

@Injectable()
export class EstablishmentService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly establishmentTypeService: EstablishmentTypeService
  ) {}

  async create(createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const user = await this.userService.create(createEstablishmentDto)
    const establishment = new Establishment()
    establishment.uuid = randomUUID()
    establishment.user = user
    establishment.areaCode = createEstablishmentDto.areaCode
    establishment.phone = createEstablishmentDto.phone
    establishment.alwaysOpen = createEstablishmentDto.alwaysOpen
    establishment.establishmentType = await this.establishmentTypeService.findByName(
      createEstablishmentDto.establishmentType
    )
    return this.establishmentRepository.save(establishment)
  }
}

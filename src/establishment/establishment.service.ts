import {Injectable} from '@nestjs/common'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {randomUUID} from 'crypto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import { AddressesService } from 'src/addresses/addresses.service'

@Injectable()
export class EstablishmentService {
  constructor(
    private readonly addressService: AddressesService,
    private readonly userService: UserService,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly establishmentTypeService: EstablishmentTypeService
  ) {}

  async create(createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const establishment = new Establishment()
    establishment.establishmentType = await this.establishmentTypeService.findByName(
      createEstablishmentDto.establishmentType
    )
    establishment.uuid = randomUUID()
    establishment.areaCode = createEstablishmentDto.areaCode
    establishment.phone = createEstablishmentDto.phone

    const user = await this.userService.create({
      email: createEstablishmentDto.email,
      name: createEstablishmentDto.name,
      username: createEstablishmentDto.username,
      userType: 'ESTABLISHMENT'
    })
    establishment.user = user
    // TODO FALTA CRIAR ADRESSES STATES E CITIES
    return this.establishmentRepository.save(establishment)
  }
}

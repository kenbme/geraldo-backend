import {Injectable} from '@nestjs/common'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {randomUUID} from 'crypto'
import {UserService} from 'src/user/user.service'
import {Repository} from 'typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import { AddressesService } from 'src/addresses/addresses.service'
import { Addresses } from 'src/addresses/entities/addresses.entity'
import { CepService } from 'src/cep/cep.service'

@Injectable()
export class EstablishmentService {
  constructor(
    private readonly addressService: AddressesService,
    private readonly userService: UserService,
    private readonly cepService:  CepService,
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
    const save = await this.establishmentRepository.save(establishment);
    const address = await this.addressService.createAddress(createEstablishmentDto, establishment.id)
    return establishment;
  }
}

import {Injectable} from '@nestjs/common'
import {CreateEstablishmentDto} from '../shared/establishment/dto/request/create-establishment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {UserService} from '../user/user.service'
import {Repository} from 'typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import {AddressService} from '../address/address.service'

@Injectable()
export class EstablishmentService {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly establishmentTypeService: EstablishmentTypeService
  ) {}

  async create(dto: CreateEstablishmentDto): Promise<Establishment> {
    const establishmentType = await this.establishmentTypeService.findByName(dto.establishmentType)
    const address = await this.addressService.createAddress(dto.postalCode, dto.houseNumber)
    const {createdUser} = await this.userService.create({
      email: dto.email,
      name: dto.name,
      username: dto.username,
      userType: 'ESTABLISHMENT'
    })
    const establishment = new Establishment()
    establishment.areaCode = dto.areaCode
    establishment.phone = dto.phone
    establishment.establishmentType = establishmentType
    establishment.user = createdUser
    establishment.address = address
    const createdEstablishment = this.establishmentRepository.save(establishment)
    return createdEstablishment
  }
}

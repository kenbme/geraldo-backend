
import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common'

import {CreateEstablishmentDto} from '../shared/establishment/dto/request/create-establishment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {UserService} from '../user/user.service'
import {Repository} from 'typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import {AddressService} from '../address/address.service'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import { UpdateEstablishmentDto } from 'src/shared/establishment/dto/request/update-establishment.dto'

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
      userType: UserTypeEnum.ESTABLISHMENT
    })
    const establishment = new Establishment()
    establishment.areaCode = dto.areaCode
    establishment.phone = dto.phone
    establishment.establishmentType = establishmentType
    establishment.user = createdUser
    establishment.address = address
    const createdEstablishment = await this.establishmentRepository.save(establishment)
    return createdEstablishment
  }

  async findByUserId(userID:number):Promise<Establishment>{
    const establishment = await this.establishmentRepository.findOne({
      where: { user: { id: userID } },
      relations: ['fuels', 'address', 'user']
  })
    if (!establishment) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }
    return establishment
  }

  async updateEstablishment(userId: number, dto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findByUserId(userId)
      establishment.address = await this.addressService.updateAddress(establishment.id,dto.postalCode,dto.houseNumber);

      establishment.areaCode = dto.areaCode;
      establishment.phone = dto.phone;
      establishment.user.name = dto.name
      establishment.user.email = dto.email
      
      return this.establishmentRepository.save(establishment);
 }
}

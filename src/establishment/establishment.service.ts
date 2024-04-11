import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEstablishmentDto } from 'src/shared/establishment/dto/request/update-establishment.dto'
import { Repository } from 'typeorm'
import { AddressService } from '../address/address.service'
import { CreateEstablishmentDto } from '../shared/establishment/dto/request/create-establishment.dto'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { UserService } from '../user/user.service'
import { Establishment } from './entities/establishment.entity'
import { EstablishmentTypeService } from './establishment.type.service'

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
    establishment.avaliations = []
    const createdEstablishment = await this.establishmentRepository.save(establishment)
    return createdEstablishment
  }

  async findById(id: number): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOne({where: {id: id}})
    if (!establishment) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }
    return establishment
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
    establishment.address = await this.addressService.createAddress(
    dto.postalCode,
    dto.houseNumber);
    establishment.areaCode = dto.areaCode;
    establishment.phone = dto.phone;
    establishment.user.name = dto.name
    establishment.user.email = dto.email
    
    return this.establishmentRepository.save(establishment);
 }
 async updateGrade(establishmentId:number):Promise<Establishment>{
    const establishment = await this.findById(establishmentId)
    let parcialGrade = 0
    for(let i=0; i<  establishment.avaliations.length;i++){
      parcialGrade += establishment.avaliations[i].grade
    }
    const newGrade = parcialGrade/establishment.avaliations.length
    establishment.grade = newGrade
    return this.establishmentRepository.save(establishment)
  }
}

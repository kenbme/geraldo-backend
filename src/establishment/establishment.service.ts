import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEstablishmentDto } from '../shared/establishment/dto/request/update-establishment.dto'
import { Repository } from 'typeorm'
import { AddressService } from '../address/address.service'
import { CreateEstablishmentDto } from '../shared/establishment/dto/request/create-establishment.dto'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { UserService } from '../user/user.service'
import { Establishment } from './entities/establishment.entity'
import { EstablishmentTypeService } from './establishment.type.service'
import { FuelTypeEnum } from '../shared/fuel/enum/fuel.type.enum'

@Injectable()
export class EstablishmentService {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly establishmentTypeService: EstablishmentTypeService
  ) { }

  async create(dto: CreateEstablishmentDto): Promise<Establishment> {
    const establishmentType = await this.establishmentTypeService.findByName(dto.establishmentType)
    const address = await this.addressService.createAddress(dto.postalCode, dto.houseNumber)
    const { createdUser } = await this.userService.create({
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
    const establishment = await this.establishmentRepository.findOne({ where: { id: id } })
    if (!establishment) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }
    return establishment
  }

  async findByUserId(userID: number): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOne({
      where: { user: { id: userID } },
      relations: ['fuels', 'address', 'user', 'establishmentType']
    })
    if (!establishment) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }
    return establishment
  }

  async updateEstablishment(userId: number, dto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findByUserId(userId)
    establishment.address = await this.addressService.updateAddress(establishment.id, dto.postalCode, dto.houseNumber);

    establishment.areaCode = dto.areaCode;
    establishment.phone = dto.phone;
    establishment.user.name = dto.name
    establishment.user.email = dto.email

    return this.establishmentRepository.save(establishment);
  }

  async updateAlwaysOpen(establishmentId: number, alwaysOpen: boolean): Promise<Establishment> {
    let establishment = await this.findById(establishmentId)
    establishment.alwaysOpen = alwaysOpen;
    return this.establishmentRepository.save(establishment);
  }

  async getEstablishments(latitude: number, longitude: number): Promise<Establishment[]> {
    const establishments = await this.establishmentRepository.find({
      relations: ['fuels', 'address', 'user', 'establishmentType']
    })
    return this.getClosestEstablishments(latitude, longitude, establishments)
  }

  async getEstablishmentsOrderedByPrice(latitude: number, longitude: number, fuelTypeName: FuelTypeEnum): Promise<Establishment[]> {
    const establishments = await this.establishmentRepository.find({
      where: { fuels: { fuelType: { name: fuelTypeName } } },
      relations: ['fuels', 'address', 'user', 'establishmentType'],
      order: { fuels: { value: 'ASC' } }
    })
    return this.getClosestEstablishments(latitude, longitude, establishments)
  }

  private getClosestEstablishments(latitude: number, longitude: number, establishments: Establishment[]): Establishment[] {
    let response: Establishment[] = []
    for (let i = 0; i < establishments.length; i++) {
      let distance = this.calculateDistanceInKilometers(latitude, longitude, establishments[i].address.latitude, establishments[i].address.longitude)
      if (distance < 5) {
        response.push(establishments[i])
      }
    }
    if (establishments.length === 0) {
      throw new NotFoundException('Não existem estabelecimentos proximos a você')
    }
    return response
  }

  private calculateDistanceInKilometers(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371
    const lat1Radians = this.degreesToRadians(lat1)
    const lat2Radians = this.degreesToRadians(lat2)
    const deltaLat = this.degreesToRadians(lat2 - lat1)
    const deltaLon = this.degreesToRadians(lon2 - lon1)
    const halfDeltaLat = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
    const halfDeltaLon = Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const a = halfDeltaLat + Math.cos(lat1Radians) * Math.cos(lat2Radians) * halfDeltaLon
    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadiusKm * centralAngle
    return distance;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

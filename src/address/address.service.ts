import {Injectable} from '@nestjs/common'
import {Address} from './entities/address.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CepService} from '../cep/cep.service'
import {StateService} from './state.service'
import {CityService} from './city.service'

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    private readonly cepService: CepService,
    private readonly stateService: StateService,
    private readonly cityService: CityService
  ) {}

  async createAddress(postalCode: string, houseNumber: string): Promise<Address> {
    const dto = await this.cepService.getAddressByCep(postalCode)
    const {latitude, longitude} = await this.cepService.getLatitudeAndLongitude(
      dto.address,
      houseNumber,
      dto.city
    )
    const state = await this.stateService.findStateByName(dto.state)
    const city = await this.cityService.saveCity(dto.city, state)
    const address = new Address()
    address.state = state
    address.city = city
    address.block = dto.district
    address.street = dto.address
    address.postalCode = postalCode
    address.houseNumber = houseNumber
    address.latitude = latitude
    address.longitude = longitude
    return await this.addressRepository.save(address)
  }

  async updateAddress(id: number, postalCode: string, houseNumber: string): Promise<Address> {
    const address = await this.addressRepository.findOneOrFail({where: {id}})

    const dto = await this.cepService.getAddressByCep(postalCode)
    const {latitude, longitude} = await this.cepService.getLatitudeAndLongitude(
      dto.address,
      houseNumber,
      dto.city
    )
    const state = await this.stateService.findStateByName(dto.state)
    const city = await this.cityService.saveCity(dto.city, state)

    address.state = state
    address.city = city
    address.block = dto.district
    address.street = dto.address
    address.postalCode = postalCode
    address.houseNumber = houseNumber
    address.latitude = latitude
    address.longitude = longitude

    return await this.addressRepository.save(address)
  }
}

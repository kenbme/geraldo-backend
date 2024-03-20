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
    const state = await this.stateService.findStateByName(dto.state)
    const city = await this.cityService.findCityByName(dto.city)
    const address = new Address()
    address.state = state
    address.city = city
    address.block = dto.district
    address.street = dto.address
    address.postalCode = postalCode
    address.houseNumber = houseNumber
    return await this.addressRepository.save(address)
  }
}

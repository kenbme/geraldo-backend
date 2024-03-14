import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {City} from './entities/cities.entity'

@Injectable()
export class CityService {
  constructor(@InjectRepository(City) private readonly cityRepository: Repository<City>) {}

  async findCityByName(name: string): Promise<City> {
    return await this.cityRepository.findOneByOrFail({name: name})
  }
}

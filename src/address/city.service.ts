import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {City} from './entities/cities.entity'
import { State } from './entities/state.entity'

@Injectable()
export class CityService {
  constructor(@InjectRepository(City) private readonly cityRepository: Repository<City>) {}
  
  async saveCity(name: string, state: State): Promise<City> {
    const city = await this.cityRepository.findOneBy({name: name, state: state})
    if (city) {
      return city
    }
    return this.cityRepository.save({name: name, state: state})
  }
}

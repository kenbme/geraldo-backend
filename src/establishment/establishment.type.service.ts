import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {EstablishmentType} from './entities/establishment.type.entity'

@Injectable()
export class EstablishmentTypeService {
  constructor(
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>
  ) {}

  async findByName(name: string): Promise<EstablishmentType> {
    return this.establishmentTypeRepository.findOneByOrFail({name: name})
  }
}

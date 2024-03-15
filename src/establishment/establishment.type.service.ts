import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {EstablishmentType} from './entities/establishment.type.entity'
import {EstablishmentTypeEnum} from '../shared/establishment/enums/establishment-type.enum'

@Injectable()
export class EstablishmentTypeService {
  constructor(
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>
  ) {}

  async findByName(name: EstablishmentTypeEnum): Promise<EstablishmentType> {
    return this.establishmentTypeRepository.findOneByOrFail({name: name})
  }
}

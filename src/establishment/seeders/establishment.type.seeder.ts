import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {EstablishmentType} from '../entities/establishment.type.entity'
import {EstablishmentTypeEnum} from '../../shared/establishment/enums/establishment-type.enum'

@Injectable()
export class EstablishmentTypeSeeder {
  constructor(
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>
  ) {}

  async seed(): Promise<void> {
    const data = [
      {name: EstablishmentTypeEnum.GAS_STATION, description: 'descricao de gas station'},
      {name: EstablishmentTypeEnum.WORKSHOP, description: 'descricao de workshop'}
    ]
    await this.establishmentTypeRepository.upsert(data, {conflictPaths: ['name']})
  }
}

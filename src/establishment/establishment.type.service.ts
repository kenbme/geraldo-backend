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

  private created = false

  async findByName(name: string): Promise<EstablishmentType> {
    if (!this.created) {
      await this.createTypes()
    }
    return this.establishmentTypeRepository.findOneByOrFail({name: name})
  }

  private async createTypes(): Promise<void> {
    const gasStationType = new EstablishmentType()
    gasStationType.name = 'GAS_STATION'
    gasStationType.description = 'descricao de gas station'

    const workshopType = new EstablishmentType()
    workshopType.name = 'WORKSHOP'
    workshopType.description = 'descricao de workshop'

    if (!(await this.establishmentTypeRepository.existsBy({name: gasStationType.name}))) {
      await this.establishmentTypeRepository.save(gasStationType)
    }

    if (!(await this.establishmentTypeRepository.existsBy({name: workshopType.name}))) {
      await this.establishmentTypeRepository.save(workshopType)
    }

    this.created = true
  }
}

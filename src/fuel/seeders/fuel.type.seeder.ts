import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import { FuelType } from '../entity/fuel.type.entity'
import { FuelTypeEnum } from 'src/shared/fuel/enum/fuelTypeEnum'

@Injectable()
export class FuelTypeSeeder {
  constructor(
    @InjectRepository(FuelType)
    private readonly fuelTypeRepository: Repository<FuelType>
  ) {}

  async seed(): Promise<void> {
    const data = [
      {name: FuelTypeEnum.GASOLINE},
      {name: FuelTypeEnum.DIESEL},
      {name: FuelTypeEnum.ETHANOL}
    ]
    await this.fuelTypeRepository.upsert(data, {conflictPaths: ['name']})
  }
}

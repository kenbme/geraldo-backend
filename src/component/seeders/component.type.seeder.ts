import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ComponentType} from '../entities/component.type.entity'
import {Repository} from 'typeorm'

@Injectable()
export class ComponentTypeSeeder {
  constructor(
    @InjectRepository(ComponentType)
    private readonly componentTypeRepository: Repository<ComponentType>
  ) {}

  async seed(): Promise<void> {
    const data = [{name: 'MOTOR_OIL'}, {name: 'BALANCE'}, {name: 'AIR_FILTER'}]
    await this.componentTypeRepository.upsert(data, {conflictPaths: ['name']})
  }
}

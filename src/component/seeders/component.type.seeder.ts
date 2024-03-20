import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ComponentType} from '../entities/component.type.entity'
import {Repository} from 'typeorm'
import {ComponentTypeEnum} from '.././../shared/component/enums/component-type.enum'

@Injectable()
export class ComponentTypeSeeder {
  constructor(
    @InjectRepository(ComponentType)
    private readonly componentTypeRepository: Repository<ComponentType>
  ) {}

  async seed(): Promise<void> {
    const data = [
      {name: ComponentTypeEnum.MOTOR_OIL},
      {name: ComponentTypeEnum.BALANCE},
      {name: ComponentTypeEnum.AIR_FILTER}
    ]
    await this.componentTypeRepository.upsert(data, {conflictPaths: ['name']})
  }
}

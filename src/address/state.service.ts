import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {State} from './entities/state.entity'

@Injectable()
export class StateService {
  constructor(@InjectRepository(State) private readonly statesRepository: Repository<State>) {}

  async findStateByName(name: string): Promise<State> {
    return await this.statesRepository.findOneByOrFail({name: name})
  }
}

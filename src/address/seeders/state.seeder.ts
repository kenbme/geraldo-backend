import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {State} from '../entities/state.entity'

@Injectable()
export class StateSeeder {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>
  ) {}

  async seed(): Promise<void> {
    const data = [
      {name: 'AC'},
      {name: 'AL'},
      {name: 'AP'},
      {name: 'AM'},
      {name: 'BA'},
      {name: 'CE'},
      {name: 'DF'},
      {name: 'ES'},
      {name: 'GO'},
      {name: 'MA'},
      {name: 'MT'},
      {name: 'MS'},
      {name: 'MG'},
      {name: 'PA'},
      {name: 'PB'},
      {name: 'PR'},
      {name: 'PE'},
      {name: 'PI'},
      {name: 'RJ'},
      {name: 'RN'},
      {name: 'RS'},
      {name: 'RO'},
      {name: 'RR'},
      {name: 'SC'},
      {name: 'SP'},
      {name: 'SE'},
      {name: 'TO'}
    ]
    await this.stateRepository.upsert(data, {conflictPaths: ['name']})
  }
}

import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {UserType} from '../entities/user.type.entity'
import {UserTypeEnum} from '../../shared/user/enums/user-type.enum'

@Injectable()
export class UserTypeSeeder {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>
  ) {}

  async seed(): Promise<void> {
    const data = [
      {name: UserTypeEnum.DRIVER, description: 'descricao de driver'},
      {name: UserTypeEnum.ESTABLISHMENT, description: 'descricao de establishment'}
    ]
    await this.userTypeRepository.upsert(data, {conflictPaths: ['name']})
  }
}

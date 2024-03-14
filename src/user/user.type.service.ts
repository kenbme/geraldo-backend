import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UserType} from './entities/user.type.entity'
import {Repository} from 'typeorm'

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>
  ) {}

  async findByName(name: string): Promise<UserType> {
    return this.userTypeRepository.findOneByOrFail({name: name})
  }
}

import {Injectable} from '@nestjs/common'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'

@Injectable()
export class EstablishmentService {
  create(createEstablishmentDto: CreateEstablishmentDto) {
    return 'This action adds a new establishment'
  }
}

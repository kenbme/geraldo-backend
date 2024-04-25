import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Establishment} from '../establishment/entities/establishment.entity'
import {EstablishmentService} from '../establishment/establishment.service'
import {CreateAvaliationDto} from '../shared/avaliation/dto/request/create_avaliation.dto'
import {GetAvaliation} from '../shared/avaliation/dto/response/get_avaliations.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {UserService} from '../user/user.service'
import {createAvaliationResponseDTO} from '../util/mapper'
import {DataSource, Repository} from 'typeorm'
import {Avaliation} from './entities/avaliation.entity'

@Injectable()
export class AvaliationService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Avaliation)
    private readonly avaliationRepository: Repository<Avaliation>,
    private readonly dataSource: DataSource,
    private readonly establishmentService: EstablishmentService
  ) {}

  async create(
    establishmentId: number,
    userId: number,
    createAvaliationDto: CreateAvaliationDto
  ): Promise<GetAvaliation> {
    const user = await this.userService.findById(userId)
    if (user.userType.name !== UserTypeEnum.DRIVER) {
      throw new ForbiddenException('Você não pode associar esse usuário')
    }
    let establishment = await this.establishmentService.findById(establishmentId)
    const avaliation = new Avaliation()
    avaliation.establishment = establishment
    avaliation.comment = createAvaliationDto.comment
    avaliation.grade = createAvaliationDto.grade
    avaliation.date = createAvaliationDto.date
    avaliation.user = user
    this.dataSource.manager.save(Avaliation, avaliation)
    establishment = await this.updateGrade(establishmentId)
    this.dataSource.manager.save(Establishment, establishment)
    const response = createAvaliationResponseDTO(avaliation)
    return response
  }

  async findByEstablishmentId(establishmentId: number): Promise<Avaliation[]> {
    const avaliation = await this.avaliationRepository.findBy({
      establishment: {id: establishmentId}
    })
    if (!avaliation) {
      throw new NotFoundException('Avaliações não encontradas')
    }
    return avaliation
  }
  async findByUserId(userId: number): Promise<Avaliation[]> {
    const avaliation = await this.avaliationRepository.findBy({user: {id: userId}})
    if (avaliation.length == 0) {
      throw new NotFoundException('Avaliaçôes não encontradas')
    }
    return avaliation
  }
  async updateGrade(establishmentId: number): Promise<Establishment> {
    const establishment = await this.establishmentService.findById(establishmentId)
    let parcialGrade = 0
    const avaliations = await this.findByEstablishmentId(establishmentId)
    if (avaliations.length == 0) {
      establishment.grade = 5
    } else {
      for (let i = 0; i < avaliations.length; i++) {
        parcialGrade += avaliations[i].grade
      }
      const newGrade = parcialGrade / avaliations.length
      console.log(newGrade)
      establishment.grade = newGrade
    }

    return establishment
  }
}

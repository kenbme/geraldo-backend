import {Controller, Post, Body} from '@nestjs/common'
import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from 'src/shared/establishment/dto/request/create-establishment.dto'
import {EstablishmentResponseDTO} from 'src/shared/establishment/dto/response/establishment.response.dto'
import {createEstablishmentResponseDTO} from 'src/util/mapper'
import {Public} from 'src/config/decorator'

@Controller('')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post('/establishment_register')
  @Public()
  async create(
    @Body() createEstablishmentDto: CreateEstablishmentDto
  ): Promise<{data: EstablishmentResponseDTO; message: string}> {
    const establishment = await this.establishmentService.create(createEstablishmentDto)
    const data = createEstablishmentResponseDTO(establishment)
    return {data, message: 'Estabelecimento cadastrado com sucesso'}
  }
}

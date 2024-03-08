import {Controller, Post, Body} from '@nestjs/common'
import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from './dto/request/create-establishment.dto'
import { EstablishmentResponseDTO } from './dto/response/establishment.response.dto'

@Controller('')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post('/establishment_register')
  async create(@Body() createEstablishmentDto: CreateEstablishmentDto): Promise<{ data: EstablishmentResponseDTO; message: string }> {
    const establishment = await this.establishmentService.create(createEstablishmentDto)
    const data = new EstablishmentResponseDTO(establishment)
    return {data, message: "Estabelecimento cadastrado com sucesso"}
  }
}

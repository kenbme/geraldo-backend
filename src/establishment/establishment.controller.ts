import {Controller, Post, Body} from '@nestjs/common'
import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'

@Controller('')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post('/establishment_register')
  async create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    const data = await this.establishmentService.create(createEstablishmentDto)
    return {data, response: "Estabelecimento cadastrado com sucesso"}
  }
}

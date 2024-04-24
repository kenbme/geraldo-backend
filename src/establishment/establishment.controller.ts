
import { Controller, Post, Body, Put, Request, UnauthorizedException, Get, Query } from '@nestjs/common'

import { EstablishmentService } from './establishment.service'
import { CreateEstablishmentDto } from '../shared/establishment/dto/request/create-establishment.dto'
import { EstablishmentResponseDTO } from '../shared/establishment/dto/response/establishment.response.dto'
import { createEstablishmentResponseDTO } from '../util/mapper'

import { Public, Roles } from '../config/decorator'
import { UpdateEstablishmentDto } from '../shared/establishment/dto/request/update-establishment.dto'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { UserRequest } from '../shared/auth/dto/user.request'
import { GetEstablishmentsQuery } from '../shared/establishment/dto/request/get-establishments-query'
import { GetEstablishmentsOrderedByPriceQuery } from '../shared/establishment/dto/request/get-establishments-ordered-query'


@Controller('')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) { }

  @Post('/establishment_register')
  @Public()
  async create(
    @Body() createEstablishmentDto: CreateEstablishmentDto
  ): Promise<{ data: EstablishmentResponseDTO; message: string }> {
    const establishment = await this.establishmentService.create(createEstablishmentDto)
    const data = createEstablishmentResponseDTO(establishment)
    return { data, message: 'Estabelecimento cadastrado com sucesso' }
  }

  @Roles(UserTypeEnum.ESTABLISHMENT)
  @Put('/establishment')
  async updateEstablishment(
    @Request() request: UserRequest,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto
  ): Promise<{ data: EstablishmentResponseDTO; message: string }> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const establishment = await this.establishmentService.updateEstablishment(userId, updateEstablishmentDto)
    const data = createEstablishmentResponseDTO(establishment)
    return { data, message: 'Estabelecimento atualizado com sucesso' }
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get("/establishments")
  async getEstablishments(
    @Query() query: GetEstablishmentsQuery
  ): Promise<{ data: EstablishmentResponseDTO[], message: string }> {
    const establishments = await this.establishmentService.getEstablishments(query.latitude, query.longitude)
    const data = establishments.map((it) => createEstablishmentResponseDTO(it))
    return { data, message: 'Lista de estabelecimentos' }
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get("/establishments_by_price")
  async getEstablishmentsOrderedByPrice(
    @Query() query: GetEstablishmentsOrderedByPriceQuery
  ): Promise<{ data: EstablishmentResponseDTO[], message: string }> {
    const establishments = await this.establishmentService.
      getEstablishmentsOrderedByPrice(query.latitude, query.longitude, query.fuelType)
    const data = establishments.map((it) => createEstablishmentResponseDTO(it))
    return { data, message: 'Lista de estabelecimentos ordenados por preço' }
  }
}


import {Controller, Post, Body, Param, Put, Request, UnauthorizedException} from '@nestjs/common'

import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from '../shared/establishment/dto/request/create-establishment.dto'
import {EstablishmentResponseDTO} from '../shared/establishment/dto/response/establishment.response.dto'
import {createEstablishmentResponseDTO} from '../util/mapper'

import {Public, Roles} from '../config/decorator'
import { UpdateEstablishmentDto } from 'src/shared/establishment/dto/request/update-establishment.dto'
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum'
import { Establishment } from './entities/establishment.entity'
import { UserRequest } from 'src/shared/auth/dto/user.request'


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

  @Roles(UserTypeEnum.ESTABLISHMENT)
  @Put('/establishment')
  async updateEstablishment(
    @Request() request: UserRequest,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto
  ): Promise<{data: EstablishmentResponseDTO; message: string}>{
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const establishment = await this.establishmentService.updateEstablishment(userId, updateEstablishmentDto)
    const data = createEstablishmentResponseDTO(establishment)
    return {data, message: 'Estabelecimento atualizado com sucesso'}
  }
}

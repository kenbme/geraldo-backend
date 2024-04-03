
import {Controller, Post, Body, Param, Put, Request, UnauthorizedException, BadRequestException, Get} from '@nestjs/common'

import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from '../shared/establishment/dto/request/create-establishment.dto'
import {EstablishmentResponseDTO} from '../shared/establishment/dto/response/establishment.response.dto'
import {createEstablishmentResponseDTO} from '../util/mapper'

import {Public, Roles} from '../config/decorator'
import { UpdateEstablishmentDto } from 'src/shared/establishment/dto/request/update-establishment.dto'
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum'
import { Establishment } from './entities/establishment.entity'
import { UserRequest } from 'src/shared/auth/dto/user.request'
import { FuelTypeEnum } from 'src/shared/fuel/enum/fuel.type.enum'


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
  
  @Roles(UserTypeEnum.DRIVER)
  @Get("/establishments/:cityId")
  async getEstablishments(
    @Param("cityId") cityId?: string
  ): Promise<{data: EstablishmentResponseDTO[], message: string}> {
    if (!cityId) {
      throw new BadRequestException("Cidade não é válida")
    }
    const establishments = await this.establishmentService.getEstablishments(parseInt(cityId))
    const data = establishments.map((it) => createEstablishmentResponseDTO(it))
    return {data, message: 'Lista de estabelecimentos'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get("/establishments/:cityId")
  async getEstablishmentsOrderedByPrice(
    @Param("cityId") cityId?: string,
    @Param("fuelType") fuelType?: string
  ): Promise<{data: EstablishmentResponseDTO[], message: string}> {
    if (!cityId) {
      throw new BadRequestException("Cidade não é válida")
    }
    if(!fuelType || !(Object.values(FuelTypeEnum).includes(fuelType as FuelTypeEnum))) {
      throw new BadRequestException("Combustivel não é válido")
    }
    const establishments = await this.establishmentService.getEstablishmentsOrderedByPrice(parseInt(cityId), fuelType as FuelTypeEnum)
    const data = establishments.map((it) => createEstablishmentResponseDTO(it))
    return {data, message: 'Lista de estabelecimentos ordenados por preço'}
  }
}

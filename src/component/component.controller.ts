import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {ComponentResponseDTO} from '../shared/component/dto/response/component.response.dto'
import {createComponentHistoryResponseDTO, createComponentResponseDTO} from '../util/mapper'
import {ComponentService} from './component.service'
import {UpdateComponentDto} from '../shared/component/dto/request/update-component.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'
import {UserRequest} from '../shared/auth/dto/user.request'
import {ComponentHistoryResponseDTO} from '../shared/component/dto/response/componentHistory.response.dto'

@Controller('')
export class ComponentController {
  constructor(private readonly componentsService: ComponentService) {}

  @Post('/vehicle_components')
  @Roles(UserTypeEnum.DRIVER)
  async create(
    @Request() request: UserRequest,
    @Body() createComponentsDTO: CreateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const userId = request.user.id
    const vehicleId = request.user.vehicleId
    if (!userId || !vehicleId) {
      throw new UnauthorizedException()
    }
    const component = await this.componentsService.create(createComponentsDTO, userId, vehicleId)
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente cadastrado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Put('/vehicle_components/:componentId')
  async update(
    @Request() request: UserRequest,
    @Param('componentId') componentId: string,
    @Body() updateComponentDTO: UpdateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const userId = request.user.id
    const vehicleId = request.user.vehicleId
    if (!userId || !vehicleId) {
      throw new UnauthorizedException()
    }
    const component = await this.componentsService.update(
      userId,
      vehicleId,
      parseInt(componentId),
      updateComponentDTO
    )
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente atualizado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Delete('/vehicle_components/:componentId')
  async delete(
    @Request() request: UserRequest,
    @Param('componentId') componentId: string
  ): Promise<{data: Object; message: string}> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    await this.componentsService.deleteComponent(userId, parseInt(componentId))
    return {data: {}, message: 'Componente deletado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get('/components')
  async getVehicleComponents(
    @Request() request: UserRequest
  ): Promise<{data: ComponentResponseDTO[]; message: string}> {
    const userId = request.user.id
    const vehicleId = request.user.vehicleId
    if (!userId || !vehicleId) {
      throw new UnauthorizedException()
    }
    const components = await this.componentsService.getVehicleComponents(userId, vehicleId)
    const data = components.map((component) => createComponentResponseDTO(component))
    return {data, message: 'Componentes encontrados'}
  }
  @Roles(UserTypeEnum.DRIVER)
  @Get('/historic/component/:componentId')
  async getUpdateHistory(
    @Request() request: UserRequest,
    @Param('componentId') componentId: string
  ): Promise<{data: ComponentHistoryResponseDTO[]; message: string}> {
    const userId = request.user.id
    const vehicleId = request.user.vehicleId
    if (!userId || !vehicleId) {
      throw new UnauthorizedException()
    }
    const updateHistory = await this.componentsService.updateHistory(
      userId,
      vehicleId,
      parseInt(componentId)
    )
    const data = updateHistory.map((componentHistory) =>
      createComponentHistoryResponseDTO(componentHistory)
    )
    return {data, message: 'Histórico de atualização encontrado'}
  }

  @Get('/check_maintenances')
  async checkMaintenances(): Promise<{componentName: string; reason: string} | null> {
    return this.componentsService.verifyAllMaintenances()
  }
}

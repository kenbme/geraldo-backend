import {Body, Controller, Delete, Get, Param, Post, Put, Request} from '@nestjs/common'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {ComponentResponseDTO} from '../shared/component/dto/response/component.response.dto'
import {createComponentResponseDTO} from '../util/mapper'
import {ComponentService} from './component.service'
import {UpdateComponentDto} from 'src/shared/component/dto/request/update-component.dto'
import {UserTypeEnum} from 'src/shared/user/enums/user-type.enum'
import {Roles} from 'src/config/decorator'

@Controller('')
export class ComponentController {
  constructor(private readonly componentsService: ComponentService) {}

  @Post('/vehicle_components')
  @Roles(UserTypeEnum.DRIVER)
  async create(
    @Request() request: Request,
    @Body() createComponentsDTO: CreateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const driverId = await (request as any).user.id
    const component = await this.componentsService.create(createComponentsDTO, driverId)
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente cadastrado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Put('/vehicle_components/:componentId')
  async update(
    @Request() request: Request,
    @Param('componentId') componentId: number,
    @Body() updateComponentDTO: UpdateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const driverId = await (request as any).user.id
    const vehicleId = await (request as any).vehicle.id
    const component = await this.componentsService.update(driverId, componentId, updateComponentDTO)
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente atualizado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Delete('/vehicle_components/:componentId')
  async delete(
    @Request() request: Request,
    @Param('componentId') componentId: number
  ): Promise<{data: Object; message: string}> {
    const userId = await (request as any).user.id
    await this.componentsService.deleteComponent(userId, componentId)
    return {data: {}, message: 'Componente deletado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get('/components/:vehicleId')
  async getVehicleComponents(
    @Request() request: Request,
    @Param('vehicleId') vehicleId: number
  ): Promise<{data: ComponentResponseDTO[]; message: string}> {
    const userId = await (request as any).user.id
    const components = await this.componentsService.getVehicleComponents(userId, vehicleId)
    const data = components.map((component) => createComponentResponseDTO(component))
    return {data, message: 'Componentes encontrados'}
  }
}

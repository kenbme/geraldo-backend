import {Body, Controller, Param, Post, Put, Request} from '@nestjs/common'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {ComponentResponseDTO} from '../shared/component/dto/response/component.response.dto'
import {createComponentResponseDTO} from '../util/mapper'
import {ComponentService} from './component.service'
import {UpdateComponentDto} from 'src/shared/component/dto/request/update-component.dto'
import {UserTypeEnum} from 'src/shared/user/enums/user-type.enum'
import {Roles} from 'src/config/decorator'

@Controller('components')
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
  @Put('/vehicle_components/{componentId}')
  async update(
    @Request() request: Request,
    @Param() componentId: number,
    updateComponentDTO: UpdateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const driverId = await (request as any).user.id
    const component = await this.componentsService.update(driverId, componentId, updateComponentDTO)
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente atualizado com sucesso'}
  }
}

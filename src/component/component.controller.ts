import {Body, Controller, HttpCode, Post} from '@nestjs/common'
import {CreateComponentDto} from '../shared/component/dto/request/create-component.dto'
import {ComponentResponseDTO} from '../shared/component/dto/response/component.response.dto'
import {createComponentResponseDTO} from '../util/mapper'
import {ComponentService} from './component.service'

@Controller('components')
export class ComponentController {
  constructor(private readonly componentsService: ComponentService) {}

  @Post('/vehicle_components')
  @HttpCode(200)
  async create(
    @Body() createComponentsDTO: CreateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const component = await this.componentsService.create(createComponentsDTO)
    const data = createComponentResponseDTO(component)
    return {data, message: 'Componente cadastrado com sucesso'}
  }
}

import {Body, Controller, HttpCode, Post} from '@nestjs/common'
import {CreateComponentDto} from 'src/shared/components/dto/request/create-component'
import {ComponentResponseDTO} from 'src/shared/components/dto/response/component.response.dto'
import {createComponentResponseDTO} from 'src/util/mapper'
import {ComponentsService} from './component.service'

@Controller('components')
export class ComponentController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post('/vehicle_components')
  @HttpCode(200)
  async create(
    @Body() createComponentsDTO: CreateComponentDto
  ): Promise<{data: ComponentResponseDTO; message: string}> {
    const vehicle = await this.componentsService.create(createComponentsDTO)
    const data = createComponentResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }
}

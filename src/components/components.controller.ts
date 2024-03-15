import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateComponentsDto } from 'src/shared/components/dto/request/create-components';
import { ComponentsResponseDTO } from 'src/shared/components/dto/response/components.response.dto';
import { createComponentResponseDTO } from 'src/util/mapper';
import { ComponentsService } from './components.service';

@Controller('components')
export class ComponentsController {
    constructor(
      private readonly componentsService: ComponentsService
    ) {}
    @Post('/vehicle_components')
    @HttpCode(200)
    async create(
      @Body() createComponentsDTO: CreateComponentsDto
    ): Promise<{data: ComponentsResponseDTO; message: string}> {
      const vehicle = await this.componentsService.create(createComponentsDTO)
      const data = createComponentResponseDTO(vehicle)
      return {data, message: 'Veiculo cadastrado com sucesso'}
    }
   

}

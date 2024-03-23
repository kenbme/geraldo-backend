import { Body, Controller, Param, Post, Put, Request} from '@nestjs/common';
import { FuelService } from './fuel.service';
import { Roles } from 'src/config/decorator';
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum';
import { CreateFuelDTO } from 'src/shared/fuel/dto/request/create-fuel.dto';
import { FuelResponseDTO } from 'src/shared/fuel/dto/response/fuel.response.dto';
import { createFuelResponseDTO } from 'src/util/mapper';

@Controller('fuel')
export class FuelController {
    constructor(private readonly fuelService: FuelService) {}

  @Post('/establishment/:estabeleshimentId/fuels')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async create(
    @Request() request: Request,
    @Param('estabeleshimentId') establishmentId: number,
    @Body() createFuelDto: CreateFuelDTO
  ): Promise<{data: FuelResponseDTO; message: string}> {
    const userId: number = await (request as any).user.id
    const fuel =  this.fuelService.create(createFuelDto, establishmentId,userId)
    const data = createFuelResponseDTO(await fuel)
    return {data, message: 'Combustivel cadastrado com sucesso'}
  }

  @Put('/establishment/:establishmentId/fuels/:fuelId')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async update(
    @Request() request: Request,
    @Param('fueltId') fuelId: number,
    @Param('estabeleshimentId') establishmentId: number,
    @Body() dto: CreateFuelDTO
  ): Promise<{data: FuelResponseDTO; message: string}> {
    const userId = await (request as any).user.id
    const fuel = await this.fuelService.update(userId,fuelId, establishmentId, dto)
    const data = createFuelResponseDTO(await fuel)
    return {data, message: 'Combustível atualizado com sucesso'}
  }

  /*
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
  }*/
}

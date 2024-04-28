import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import {FuelService} from './fuel.service'
import {Roles} from '../config/decorator'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {CreateFuelDTO} from '../shared/fuel/dto/request/create-fuel.dto'
import {FuelResponseDTO} from '../shared/fuel/dto/response/fuel.response.dto'
import {createFuelResponseDTO} from '../util/mapper'
import {UserRequest} from '../shared/auth/dto/user.request'
import {UpdateFuelDTO} from '../shared/fuel/dto/request/update.fuel.dto'

@Controller('')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post('/fuels')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async create(
    @Request() request: UserRequest,
    @Body() createFuelDto: CreateFuelDTO
  ): Promise<{data: FuelResponseDTO; message: string}> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const fuel = await this.fuelService.create(createFuelDto, userId)
    const data = createFuelResponseDTO(fuel)
    return {data, message: 'Combustivel cadastrado com sucesso'}
  }

  @Put('/fuels/:fuelId')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async update(
    @Request() request: UserRequest,
    @Param('fuelId') fuelId: string,
    @Body() dto: UpdateFuelDTO
  ): Promise<{data: FuelResponseDTO; message: string}> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const fuel = await this.fuelService.update(userId, parseInt(fuelId), dto)
    const data = createFuelResponseDTO(fuel)
    return {data, message: 'Combustível atualizado com sucesso'}
  }
  @Get('/fuels')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async get(@Request() request: UserRequest): Promise<{data: FuelResponseDTO[]; message: string}> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const fuels = await this.fuelService.getFuels(userId)
    const data = fuels.map((fuel) => createFuelResponseDTO(fuel))
    return {data, message: 'Combustíveis encontrados'}
  }
}

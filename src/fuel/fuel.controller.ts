import { Body, Controller, Param, Post, Put, Request, UnauthorizedException} from '@nestjs/common';
import { FuelService } from './fuel.service';
import { Roles } from 'src/config/decorator';
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum';
import { CreateFuelDTO } from 'src/shared/fuel/dto/request/create-fuel.dto';
import { FuelResponseDTO } from 'src/shared/fuel/dto/response/fuel.response.dto';
import { createFuelResponseDTO } from 'src/util/mapper';
import { UserRequest } from 'src/shared/auth/dto/user.request';
import { UpdateFuelDTO } from 'src/shared/fuel/dto/request/update.fuel.dto';

@Controller('')
export class FuelController {
    constructor(private readonly fuelService: FuelService) {}

  @Post('/establishment/fuels')
  @Roles(UserTypeEnum.ESTABLISHMENT)
  async create(
    @Request() request: UserRequest,
    @Body() createFuelDto: CreateFuelDTO
  ): Promise<{data: FuelResponseDTO; message: string}> {
    const userId =  request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const fuel =  await this.fuelService.create(createFuelDto,userId)
    const data = createFuelResponseDTO(fuel)
    return {data, message: 'Combustivel cadastrado com sucesso'}
  }

  @Put('/establishment/fuels/:fuelId')
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
    const fuel = await this.fuelService.update(userId,parseInt(fuelId), dto)
    const data = createFuelResponseDTO(fuel)
    return {data, message: 'Combustível atualizado com sucesso'}
  }
  
}

import {Body, Controller, Get, HttpCode, Post} from '@nestjs/common'
import {UUID} from 'crypto'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {VehicleService} from './vehicle.service'
import {createVehicleResponseDTO} from '../util/mapper'
import {VehicleResponseDTO} from '../shared/vehicle/dto/response/vahicle.response.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(UserTypeEnum.DRIVER)
  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Body() createVehicleDto: CreateVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const vehicle = await this.vehicleService.create(createVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }

  @Get('/vehicles/{driverId}')
  async getVehicles(
    @Body() driverId: UUID
  ): Promise<{data: VehicleResponseDTO[]; message: string}> {
    const vehicles = await this.vehicleService.getVehicles(driverId)
    const vehicleResponseDTO = vehicles.map((vehicle) => createVehicleResponseDTO(vehicle))
    return {data: vehicleResponseDTO, message: 'Veículos encontrados'}
  }
}

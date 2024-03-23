import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {VehicleService} from './vehicle.service'
import {createVehicleResponseDTO} from '../util/mapper'
import {VehicleResponseDTO} from '../shared/vehicle/dto/response/vahicle.response.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'
import {ShareVehicleDto} from '../shared/vehicle/dto/request/share-vehicle.dto'
import {UpdateKilometersDto} from '../shared/vehicle/dto/request/update-kilometers.dto'
import {UserRequest} from '../shared/auth/dto/user.request'

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(UserTypeEnum.DRIVER)
  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Request() request: UserRequest,
    @Body() createVehicleDto: CreateVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const userId = await request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const vehicle = await this.vehicleService.create(userId, createVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get('/vehicles')
  async getVehicles(
    @Request() request: UserRequest
  ): Promise<{data: VehicleResponseDTO[]; message: string}> {
    const userId = await request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const vehicles = await this.vehicleService.getVehicles(userId)
    const vehiclesResponseDTO = vehicles.map((vehicle) => createVehicleResponseDTO(vehicle))
    return {data: vehiclesResponseDTO, message: 'Veículos encontrados'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Post('/share_vehicle/:vehicleId')
  async shareVehicle(
    @Request() request: UserRequest,
    @Param('vehicleId') vehicleId: number,
    @Body() shareVehicleDto: ShareVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const userId = await request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const vehicle = await this.vehicleService.shareVehicle(vehicleId, userId, shareVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo compartilhado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Patch('/kilometers/:vehicleId')
  async updateKilometers(
    @Request() request: UserRequest,
    @Param('vehicleId') vehicleId: number,
    @Body() updateKilometersDto: UpdateKilometersDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const userId = await request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const vehicle = await this.vehicleService.updateKilometers(
      userId,
      vehicleId,
      updateKilometersDto
    )
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Quilometragem do veículo atualizada com sucesso'}
  }
}

import {Body, Controller, Get, HttpCode, Param, Patch, Post, Request} from '@nestjs/common'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {VehicleService} from './vehicle.service'
import {createVehicleResponseDTO} from '../util/mapper'
import {VehicleResponseDTO} from '../shared/vehicle/dto/response/vahicle.response.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'
import {ShareVehicleDto} from 'src/shared/vehicle/dto/request/share-vehicle.dto'
import {UpdateKilometersDto} from 'src/shared/vehicle/dto/request/update-kilometers.dto'

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(UserTypeEnum.DRIVER)
  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Request() request: Request,
    @Body() createVehicleDto: CreateVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const userId: number = await (request as any).user.id
    const vehicle = await this.vehicleService.create(userId, createVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Get('/vehicles')
  async getVehicles(
    @Request() request: Request
  ): Promise<{data: VehicleResponseDTO[]; message: string}> {
    const userId: number = await (request as any).user.id
    const vehicles = await this.vehicleService.getVehicles(userId)
    const vehiclesResponseDTO = vehicles.map((vehicle) => createVehicleResponseDTO(vehicle))
    return {data: vehiclesResponseDTO, message: 'Veículos encontrados'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Post('/share_vehicle/:vehicleId')
  async shareVehicle(
    @Request() request: Request,
    @Param('vehicleId') vehicleId: number,
    @Body() shareVehicleDto: ShareVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const userId: number = await (request as any).user.id
    const vehicle = await this.vehicleService.shareVehicle(vehicleId, userId, shareVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo compartilhado com sucesso'}
  }

  @Roles(UserTypeEnum.DRIVER)
  @Patch('/kilometers/:vehicleId')
  async updateKilometers(
    @Request() request: Request,
    @Param('vehicleId') vehicleId: number,
    @Body() updateKilometersDto: UpdateKilometersDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const driverId: number = await (request as any).user.id
    const vehicle = await this.vehicleService.updateKilometers(driverId, vehicleId, updateKilometersDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Quilometragem do veículo atualizada com sucesso'}
  }
}

import {Body, Controller, Get, HttpCode, Param, Post, Req} from '@nestjs/common'
import {UUID} from 'crypto'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {VehicleService} from './vehicle.service'
import {createVehicleResponseDTO} from '../util/mapper'
import {VehicleResponseDTO} from '../shared/vehicle/dto/response/vahicle.response.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/config/authguard'
import { Reflector } from '@nestjs/core'
import { ShareVehicleDto } from 'src/shared/vehicle/dto/request/share-vehicle.dto'

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService,
              private readonly jwtService: JwtService
              ) {}

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


  @Roles(UserTypeEnum.DRIVER)
  @Post('/share_vehicle/{vehicleId}')
  async shareVehicle(
    @Req() request: Request,
    @Param('vehicleId') vehicleId: UUID, 
    @Body() shareVehicleDto: ShareVehicleDto
  ): Promise<{ data: VehicleResponseDTO; message: string }> {
    const jwt = request.headers.get('authorization');

    if (!jwt) {
      throw new Error('O cabeçalho de autorização está ausente.');
    }

    const token = jwt.split('Bearer ')[1];
    const decodedToken = this.jwtService.decode(token) as { uuid: UUID };
    const uuidOwner = decodedToken.uuid;

    const vehicle = await this.vehicleService.shareVehicle(vehicleId, uuidOwner, shareVehicleDto);
    const data = createVehicleResponseDTO(vehicle);
     
    return {data, message: 'Veiculo compartilhado com sucesso'}
  }
}
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto';
import { VehicleResponseDTO } from 'src/shared/vehicle/dto/response/vahicle.response.dto';
import { VehicleService } from './vehicle.service';

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Body() body: {createVehicleDto: CreateVehicleDto; driverUUid: UUID}
  ): Promise<{data: CreateVehicleDto; message: string}> {
    const {createVehicleDto, driverUUid} = body
    const vehicle = await this.vehicleService.create(driverUUid, createVehicleDto)
    const data = new VehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }
}

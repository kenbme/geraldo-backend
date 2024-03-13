import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto';
import { VehicleService } from './vehicle.service';
import { createVehicleResponseDTO } from 'src/util/mapper';
import { VehicleResponseDTO } from 'src/shared/vehicle/dto/response/vahicle.response.dto';

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Body() createVehicleDto: CreateVehicleDto
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const vehicle = await this.vehicleService.create(createVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }
}

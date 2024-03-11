import { Body, Controller, Post } from '@nestjs/common';
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto';
import { VehicleResponseDTO } from 'src/shared/vehicle/dto/response/vahicle.response.dto';
import { VehicleService } from './vehicle.service';

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/vehicle')
  async create(
    @Body() body: {createVehicleDto: CreateVehicleDto; driverId: number}
  ): Promise<{data: CreateVehicleDto; message: string}> {
    const {createVehicleDto, driverId} = body
    const vehicle = await this.vehicleService.create(driverId, createVehicleDto)
    const data = new VehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }
}

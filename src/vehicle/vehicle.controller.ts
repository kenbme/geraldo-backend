import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto';
import { VehicleService } from './vehicle.service';
import { createVehicleResponseDTO } from 'src/util/mapper';
import { VehicleResponseDTO } from 'src/shared/vehicle/dto/response/vahicle.response.dto';
import { UpdateKilometersDto } from 'src/shared/vehicle/dto/request/update-kilometers.dto';
import { Roles } from 'src/decorator';
import { UserType } from 'src/user/entities/user.type.entity';
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum';

@Controller('')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(UserTypeEnum.DRIVER)
  @Post('/vehicle')
  @HttpCode(200)
  async create(
    @Body() body: {createVehicleDto: CreateVehicleDto; driverUUid: UUID}
  ): Promise<{data: VehicleResponseDTO; message: string}> {
    const {createVehicleDto, driverUUid} = body
    const vehicle = await this.vehicleService.create(driverUUid, createVehicleDto)
    const data = createVehicleResponseDTO(vehicle)
    return {data, message: 'Veiculo cadastrado com sucesso'}
  }

}

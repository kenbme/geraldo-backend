import {Body, Controller, HttpCode, Post} from '@nestjs/common'
import {CreateVehicleDto} from 'src/shared/vehicle/dto/request/create-vehicle.dto'
import {VehicleService} from './vehicle.service'
import {createVehicleResponseDTO} from 'src/util/mapper'
import {VehicleResponseDTO} from 'src/shared/vehicle/dto/response/vahicle.response.dto'
import {Roles} from 'src/decorator'
import {UserTypeEnum} from 'src/shared/user/enums/user-type.enum'

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
}

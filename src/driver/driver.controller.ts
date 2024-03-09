import {Controller, Post, Body} from '@nestjs/common'
import {DriverService} from './driver.service'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'
import {DriverResponseDTO} from '../shared/driver/dto/response/driver.response.dto'

@Controller('')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver_register')
  async create(
    @Body() createDriverDto: CreateDriverDto
  ): Promise<{data: DriverResponseDTO; message: string}> {
    const driver = await this.driverService.create(createDriverDto)
    const data = new DriverResponseDTO(driver)
    return {data, message: 'Motorista cadastrado com sucesso'}
  }
}

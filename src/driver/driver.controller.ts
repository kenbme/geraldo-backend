import {Controller, Post, Body} from '@nestjs/common'
import {DriverService} from './driver.service'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'
import {DriverResponseDTO} from '../shared/driver/dto/response/driver.response.dto'
import {createDriverResponseDTO} from '../util/mapper'
import {Public} from '../config/decorator'

@Controller('')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver_register')
  @Public()
  async create(
    @Body() createDriverDto: CreateDriverDto
  ): Promise<{data: DriverResponseDTO; message: string}> {
    const driver = await this.driverService.create(createDriverDto)
    const data = createDriverResponseDTO(driver)
    return {data, message: 'Motorista cadastrado com sucesso'}
  }
}

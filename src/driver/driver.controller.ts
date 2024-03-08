import {Controller, Post, Body} from '@nestjs/common'
import {DriverService} from './driver.service'
import {CreateDriverDto} from './dto/create-driver.dto'

@Controller('')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver_register')
  async create(@Body() createDriverDto: CreateDriverDto) {
    const data = await this.driverService.create(createDriverDto)
    return {data, message: 'Motorista cadastrado com sucesso'}
  }
}

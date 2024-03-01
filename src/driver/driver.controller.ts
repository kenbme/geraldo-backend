import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {DriverService} from './driver.service'
import {CreateDriverDto} from './dto/create-driver.dto'
import {UpdateDriverDto} from './dto/update-driver.dto'

@Controller('')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver_register')
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto)
  }
}

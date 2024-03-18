import {Controller, Post, Body} from '@nestjs/common'
import {DriverService} from './driver.service'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'
import {createUserResponseDTO} from '../util/mapper'
import {Public} from '../config/decorator'
import {UserResponseDTO} from 'src/shared/user/dto/response/user.response.dto'

@Controller('')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver_register')
  @Public()
  async create(
    @Body() createDriverDto: CreateDriverDto
  ): Promise<{data: UserResponseDTO; message: string}> {
    const driver = await this.driverService.create(createDriverDto)
    const data = createUserResponseDTO(driver)
    return {data, message: 'Motorista cadastrado com sucesso'}
  }
}

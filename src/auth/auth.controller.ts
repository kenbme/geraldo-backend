import {Body, Controller, HttpCode, HttpStatus, Post, Request} from '@nestjs/common'
import {AuthService} from './auth.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import {LoginRequestDTO} from '../shared/auth/dto/request/login.request.dto'
import {Public, Roles} from '../config/decorator'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {SelectCarDTO} from '../shared/auth/dto/request/select-car.request.dto'

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginRequestDTO
  ): Promise<{data: LoginResponseDTO; message: string}> {
    const data = await this.authService.login(loginDto.username, loginDto.password)
    return {data, message: 'Login feito com sucesso'}
  }

  @HttpCode(HttpStatus.OK)
  @Post('select-car')
  @Roles(UserTypeEnum.DRIVER)
  async selectCar(
    @Request() request: Request,
    @Body() selectDarDto: SelectCarDTO
  ): Promise<{data: LoginResponseDTO; message: string}> {
    const userId = (request as any).user.id
    const data = await this.authService.selectCar(userId, selectDarDto.vehicleId)
    return {data, message: 'Carro selecionado com sucesso'}
  }
}

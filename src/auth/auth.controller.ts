import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import {AuthService} from './auth.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import {LoginRequestDTO} from '../shared/auth/dto/request/login.request.dto'
import {Public, Roles} from '../config/decorator'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {SelectCarDTO} from '../shared/auth/dto/request/select-car.request.dto'
import {UserRequest} from '../shared/auth/dto/user.request'

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
  @Post('select_vehicle')
  @Roles(UserTypeEnum.DRIVER)
  async selectCar(
    @Request() request: UserRequest,
    @Body() selectDarDto: SelectCarDTO
  ): Promise<{data: LoginResponseDTO; message: string}> {
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const data = await this.authService.selectCar(userId, selectDarDto.vehicleId)
    return {data, message: 'Carro selecionado com sucesso'}
  }
}

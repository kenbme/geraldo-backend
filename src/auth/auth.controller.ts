import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import {LoginRequestDTO} from 'src/shared/auth/dto/request/login.request.dto'

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDTO
  ): Promise<{data: LoginResponseDTO; message: string}> {
    const data = await this.authService.login(loginDto.username, loginDto.password)
    return {data, message: 'Login feito com sucesso'}
  }
}

import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {LoginDTO} from './dto/login.dto'
import { LoginResponseDTO } from './dto/response/login.response.dto'

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDTO): Promise<{ data: LoginResponseDTO; message: string }> {
    const data = await this.authService.login(loginDto.username, loginDto.password)
    return {data, message: "Login feito com sucesso"}
  }
}

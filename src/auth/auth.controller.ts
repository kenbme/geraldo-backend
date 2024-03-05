import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {LoginDTO} from './dto/login.dto'

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto.username, loginDto.password)
  }
}

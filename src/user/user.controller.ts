import {Controller, Post, Body, HttpCode} from '@nestjs/common'
import {RecoverPasswordDto} from './dto/request/recover-password.dto'
import {UserService} from './user.service'

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/forgot_password')
  @HttpCode(200)
  async recoverPassword(
    @Body() recoverPasswordDTO: RecoverPasswordDto
  ): Promise<{message: string}> {
    await this.userService.recoverPassword(recoverPasswordDTO)
    return {message: 'Uma senha temporária foi enviada para o seu email'}
  }
}

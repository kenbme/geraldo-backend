import {Controller, Post, Body, HttpCode, Get,Request, UnauthorizedException} from '@nestjs/common'
import {RecoverPasswordDto} from '../shared/user/dto/request/recover-password.dto'
import {UserService} from './user.service'
import {Public} from '../config/decorator'
import { UserRequest } from 'src/shared/auth/dto/user.request';
import { UserResponseDTO } from 'src/shared/user/dto/response/user.response.dto';
import { createUserResponseDTO } from 'src/util/mapper';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/forgot_password')
  @HttpCode(200)
  @Public()
  async recoverPassword(
    @Body() recoverPasswordDTO: RecoverPasswordDto
  ): Promise<{message: string; data: Object}> {
    await this.userService.recoverPassword(recoverPasswordDTO)
    return {message: 'Uma senha temporária foi enviada para o seu email', data: {}}
  }
  @Get('/user_perfil')
  @HttpCode(200)
  async getPerfil( @Request() request: UserRequest): Promise<{data: UserResponseDTO; message: string}>{
    const userId = request.user.id
    if (!userId) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findById(userId)
    const data = createUserResponseDTO(user)
    return {message: 'Perfil encontrado com sucesso', data}
  }
  
}

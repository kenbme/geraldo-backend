import {Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {UserService} from '../user/user.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import {createLoginPayload} from '../util/mapper'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(username: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.userService.findByUsername(username)
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException()
    }
    const {id, userType, resetPassword} = createLoginPayload(user)
    return {
      access_token: await this.jwtService.signAsync(
        {id, userType, resetPassword},
        {
          secret: process.env.JWT_SECRET_KEY
        }
      )
    }
  }
}

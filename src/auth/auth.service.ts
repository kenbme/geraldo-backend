import {Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {UserService} from 'src/user/user.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import { createLoginPayload } from 'src/util/mapper'

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
    const {id, userType} = createLoginPayload(user)
    
    return {
      access_token: await this.jwtService.signAsync({id, userType}, {
        secret: process.env.JWT_SECRET_KEY
      })
    }
  }
}

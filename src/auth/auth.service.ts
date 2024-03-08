import {Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {UserService} from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(username: string, password: string): Promise<{access_token: string}> {
    const user = await this.userService.findByUsername(username)
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException()
    }
    const payload = {
      sub: user.id,
      username: user.name,
      userType: user.userType.name
    }
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY
      })
    }
  }
}

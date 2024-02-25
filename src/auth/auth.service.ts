import {Injectable, UnauthorizedException} from '@nestjs/common'
import {User} from 'src/user/entities/user.entity'
import {Repository} from 'typeorm'
import {JwtService} from '@nestjs/jwt'
import {InjectRepository} from '@nestjs/typeorm'
import {jwtConstants} from './constants'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    password: string
  ): Promise<{access_token: string}> {
    const user = await this.userRepository.findOneByOrFail({
      email: email
    })
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException()
    }
    const payload = {
      sub: user.id,
      username: user.name,
      role: user.role
    }
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret
      })
    }
  }
}

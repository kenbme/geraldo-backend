import {Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {UserService} from '../user/user.service'
import {LoginResponseDTO} from '../shared/auth/dto/response/login.response.dto'
import {createLoginPayload} from '../util/mapper'
import {UserTypeEnum} from 'src/shared/user/enums/user-type.enum'
import {VehicleService} from 'src/vehicle/vehicle.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly vehicleService: VehicleService
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

  async selectCar(userId: number, vehicleIdd: number): Promise<LoginResponseDTO> {
    const user = await this.userService.findById(userId)
    if (user.userType.name !== UserTypeEnum.DRIVER) {
      throw new UnauthorizedException('Você não pode selecionar um carro')
    }
    const vehicle = await this.vehicleService.findById(vehicleIdd)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException({message: 'Veículo informado não pertence ao motorista'})
    }
    const {id, userType, resetPassword, vehicleId} = createLoginPayload(user, vehicle.id)
    return {
      access_token: await this.jwtService.signAsync(
        {id, userType, resetPassword, vehicleId},
        {
          secret: process.env.JWT_SECRET_KEY
        }
      )
    }
  }
}

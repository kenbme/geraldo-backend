import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { LoginResponseDTO } from '../shared/auth/dto/response/login.response.dto'
import { createLoginPayload } from '../util/mapper'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { VehicleService } from '../vehicle/vehicle.service'
import { EstablishmentService } from '../establishment/establishment.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly vehicleService: VehicleService,
    private readonly establishmentService: EstablishmentService
  ) { }

  async login(username: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.userService.findByUsername(username)
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException()
    }
    const { id, userType, resetPassword } = createLoginPayload(user)
    let access_token: string;
    
    
    //Se for um establishment, retornamos junto as informações referentes ao estabelecimento
    if (userType === UserTypeEnum.ESTABLISHMENT) {
      const establishment = await this.establishmentService.findByUserId(user.id);
      const establishmentInfo = {
        name: establishment.user.name,
        longitude: establishment.address.longitude,
        latitude: establishment.address.latitude,
        houseNumber: establishment.address.houseNumber,
        establishmentType: establishment.establishmentType
      }
      access_token = await this.jwtService.signAsync(
        { id, userType, resetPassword, establishmentInfo},
        {
          secret: process.env.JWT_SECRET_KEY
        }
      )
    }

    //Do contrario, será retornado apenas as informações do usuário
    else {
      access_token = await this.jwtService.signAsync(
        { id, userType, resetPassword },
        {
          secret: process.env.JWT_SECRET_KEY
        }
      )
    }
    return {access_token, isDriver: user.userType.name === UserTypeEnum.DRIVER};
  }

  async selectCar(userId: number, vehicleIdd: number): Promise<LoginResponseDTO> {
    const user = await this.userService.findById(userId)
    if (user.userType.name !== UserTypeEnum.DRIVER) {
      throw new UnauthorizedException('Você não pode selecionar um carro')
    }
    const vehicle = await this.vehicleService.findById(vehicleIdd)
    const isDriver = vehicle.drivers.some((it) => it.user.id === userId)
    if (!isDriver) {
      throw new UnauthorizedException({ message: 'Veículo informado não pertence ao motorista' })
    }
    const { id, userType, resetPassword, vehicleId } = createLoginPayload(user, vehicle.id)
    return {
      access_token: await this.jwtService.signAsync(
        { id, userType, resetPassword, vehicleId },
        {
          secret: process.env.JWT_SECRET_KEY,
        }
      ), 
      isDriver: user.userType.name === UserTypeEnum.DRIVER
    }
  }
}

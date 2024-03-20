import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {UserModule} from '../user/user.module'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {VehicleModule} from 'src/vehicle/vehicle.module'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '100000000s'}
    }),
    VehicleModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

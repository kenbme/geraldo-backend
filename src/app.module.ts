import {Module} from '@nestjs/common'
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AuthModule} from './auth/auth.module'
import {BadRequestExceptionFilter} from './badrequest.filter'
import {CepModule} from './cep/cep.module'
import {DriverModule} from './driver/driver.module'
import {Driver} from './driver/entities/driver.entity'
import {Establishment} from './establishment/entities/establishment.entity'
import {EstablishmentType} from './establishment/entities/establishment.type.entity'
import {EstablishmentModule} from './establishment/establishment.module'
import {HttpExceptionExceptionFilter} from './httpexception.filter '
import {ResponseInterceptor} from './response.interceptor'
import {TypeORMExceptionFilter} from './typeorm.filter '
import {User} from './user/entities/user.entity'
import {UserType} from './user/entities/user.type.entity'
import {UserModule} from './user/user.module'
import {Vehicle} from './vehicle/entities/vehicle.entity'
import {VehicleModule} from './vehicle/vehicle.module'
import {AuthGuard} from './authguard'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/development.sqlite3',
      synchronize: true,
      entities: [User, UserType, Driver, Establishment, EstablishmentType, Vehicle]
    }),
    UserModule,
    AuthModule,
    CepModule,
    DriverModule,
    EstablishmentModule,
    VehicleModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}

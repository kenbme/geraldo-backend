import {Module} from '@nestjs/common'
import {UserModule} from './user/user.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user/entities/user.entity'
import {AuthModule} from './auth/auth.module'
import {Driver} from './driver/entities/driver.entity'
import {Establishment} from './establishment/entities/establishment.entity'
import {UserType} from './user/entities/user.type.entity'
import {EstablishmentType} from './establishment/entities/establishment.type.entity'
import {CepModule} from './cep/cep.module'
import {DriverModule} from './driver/driver.module'
import {EstablishmentModule} from './establishment/establishment.module'
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core'
import {ResponseInterceptor} from './response.interceptor'
import {BadRequestExceptionFilter} from './badrequest.filter'
import {HttpExceptionExceptionFilter} from './httpexception.filter '
import {TypeORMExceptionFilter} from './typeorm.filter '

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/development.sqlite3',
      synchronize: true,
      entities: [User, UserType, Driver, Establishment, EstablishmentType]
    }),
    UserModule,
    AuthModule,
    CepModule,
    DriverModule,
    EstablishmentModule
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
    }
  ]
})
export class AppModule {}

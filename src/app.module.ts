import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user/entities/user.entity'
import {AuthModule} from './auth/auth.module'
import {DriverModule} from './driver/driver.module'
import {EstablishmentModule} from './establishment/establishment.module'
import {Driver} from './driver/entities/driver.entity'
import {Establishment} from './establishment/entities/establishment.entity'
import {UserType} from './user/entities/user.type.entity'
import { EstablishmentType } from './establishment/entities/establishment.type.entity'

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
    DriverModule,
    EstablishmentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

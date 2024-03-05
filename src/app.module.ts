import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user/entities/user.entity'
import {AuthModule} from './auth/auth.module'
import {CepModule} from './cep/cep.module'
import { UserType } from './user/entities/user.type.entity'
import { Driver } from './driver/entities/driver.entity'
import { Establishment } from './establishment/entities/establishment.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/development.sqlite3',
      synchronize: true,
      entities: [User, UserType, Driver, Establishment]
    }),
    UserModule,
    AuthModule,
    CepModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

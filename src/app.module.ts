import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user/entities/user.entity'
import {AuthModule} from './auth/auth.module'
import {DriverModule} from './driver/driver.module'
import {EstablishmentModule} from './establishment/establishment.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [User]
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

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
import { AddressesModule } from './addresses/addresses.module';
import { Addresses } from './addresses/entities/addresses.entity'
import { City } from './addresses/entities/cities.entity'
import { State } from './addresses/entities/state.entity'
import { EstablishmentModule } from './establishment/establishment.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/development.sqlite3',
      synchronize: true,
      entities: [User, UserType, Driver, Establishment, EstablishmentType,Addresses,City,State]
    }),
    UserModule,
    AuthModule,
    CepModule,
    AddressesModule,
    EstablishmentModule
  ]
})
export class AppModule {}

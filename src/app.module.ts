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
import {RolesGuard} from './roles.guard'
import {State} from './addresses/entities/state.entity'
import {City} from './addresses/entities/cities.entity'
import {AddressesModule} from './addresses/addresses.module'
import {Address} from './addresses/entities/addresses.entity'
import {SeederService} from './seeder.service'
import {StateSeeder} from './addresses/seeders/state.seeder'
import {UserTypeSeeder} from './user/seeders/user.type.seeder'
import {EstablishmentTypeSeeder} from './establishment/seeders/establishment.type.seeder'
import { Component } from './component/entities/component.entity'
import { ComponentType } from './component/entities/component.type.entity'
import { ComponentModule } from './component/component.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/development.sqlite3',
      synchronize: true,
      entities: [
        User,
        UserType,
        Driver,
        Establishment,
        EstablishmentType,
        Vehicle,
        Address,
        State,
        City,
        Component,
        ComponentType
      ]
    }),
    TypeOrmModule.forFeature([EstablishmentType, UserType, State, ComponentType]),
    UserModule,
    AuthModule,
    CepModule,
    DriverModule,
    EstablishmentModule,
    VehicleModule,
    ComponentModule,
    AddressesModule
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
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    StateSeeder,
    UserTypeSeeder,
    EstablishmentTypeSeeder,
    SeederService
  ]
})
export class AppModule {}

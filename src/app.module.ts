import {Module} from '@nestjs/common'
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AuthModule} from './auth/auth.module'
import {BadRequestExceptionFilter} from './config/badrequest.filter'
import {CepModule} from './cep/cep.module'
import {DriverModule} from './driver/driver.module'
import {Driver} from './driver/entities/driver.entity'
import {Establishment} from './establishment/entities/establishment.entity'
import {EstablishmentType} from './establishment/entities/establishment.type.entity'
import {EstablishmentModule} from './establishment/establishment.module'
import {HttpExceptionExceptionFilter} from './config/httpexception.filter '
import {ResponseInterceptor} from './config/response.interceptor'
import {TypeORMExceptionFilter} from './config/typeorm.filter '
import {User} from './user/entities/user.entity'
import {UserType} from './user/entities/user.type.entity'
import {UserModule} from './user/user.module'
import {Vehicle} from './vehicle/entities/vehicle.entity'
import {VehicleModule} from './vehicle/vehicle.module'
import {AuthGuard} from './config/authguard'
import {RolesGuard} from './config/roles.guard'
import {State} from './address/entities/state.entity'
import {City} from './address/entities/cities.entity'
import {AddressModule} from './address/address.module'
import {Address} from './address/entities/address.entity'
import {SeederService} from './config/seeder.service'
import {StateSeeder} from './address/seeders/state.seeder'
import {UserTypeSeeder} from './user/seeders/user.type.seeder'
import {EstablishmentTypeSeeder} from './establishment/seeders/establishment.type.seeder'
import {Component} from './component/entities/component.entity'
import {ComponentType} from './component/entities/component.type.entity'
import {ComponentModule} from './component/component.module'
import {ComponentTypeSeeder} from './component/seeders/component.type.seeder'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'verceldb',
      username: 'default',
      password: 'T3Q8EeWnqJYg',
      host: 'ep-silent-resonance-a4dk8ug8-pooler.us-east-1.aws.neon.tech',
      ssl: true,
      port: 5432,
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
    AddressModule
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
    ComponentTypeSeeder,
    SeederService
  ]
})
export class AppModule {}

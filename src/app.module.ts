import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressModule } from './address/address.module'
import { Address } from './address/entities/address.entity'
import { City } from './address/entities/cities.entity'
import { State } from './address/entities/state.entity'
import { StateSeeder } from './address/seeders/state.seeder'
import { AuthModule } from './auth/auth.module'
import { AvaliationModule } from './avaliation/avaliation.module'
import { Avaliation } from './avaliation/entities/avaliation.entity'
import { CepModule } from './cep/cep.module'
import { ComponentModule } from './component/component.module'
import { Component } from './component/entities/component.entity'
import { ComponentType } from './component/entities/component.type.entity'
import { ComponentTypeSeeder } from './component/seeders/component.type.seeder'
import { AuthGuard } from './config/authguard'
import { BadRequestExceptionFilter } from './config/badrequest.filter'
import { HttpExceptionExceptionFilter } from './config/httpexception.filter '
import { ResponseInterceptor } from './config/response.interceptor'
import { RolesGuard } from './config/roles.guard'
import { SeederService } from './config/seeder.service'
import { TypeORMExceptionFilter } from './config/typeorm.filter '
import { DriverModule } from './driver/driver.module'
import { Driver } from './driver/entities/driver.entity'
import { Establishment } from './establishment/entities/establishment.entity'
import { EstablishmentType } from './establishment/entities/establishment.type.entity'
import { EstablishmentModule } from './establishment/establishment.module'
import { EstablishmentTypeSeeder } from './establishment/seeders/establishment.type.seeder'
import { Fuel } from './fuel/entities/fuel.entity'
import { FuelType } from './fuel/entities/fuel.type.entity'
import { FuelModule } from './fuel/fuel.module'
import { FuelTypeSeeder } from './fuel/seeders/fuel.type.seeder'
import { Schedule } from './schedule/entities/schedule.entity'
import { Shift } from './schedule/entities/shift.entity'
import { ScheduleModule } from './schedule/schedule.module'
import { User } from './user/entities/user.entity'
import { UserType } from './user/entities/user.type.entity'
import { UserTypeSeeder } from './user/seeders/user.type.seeder'
import { UserModule } from './user/user.module'
import { Vehicle } from './vehicle/entities/vehicle.entity'
import { VehicleModule } from './vehicle/vehicle.module'
import { ComponentHistory } from './component/entities/ComponentHistory.entity'

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
        ComponentType,
<<<<<<< HEAD
        Avaliation,
=======
        ComponentHistory,
>>>>>>> origin/sprint4/feat/RF14
        Fuel,
        Shift,
        Schedule,
        FuelType
      ]
    }),
    TypeOrmModule.forFeature([EstablishmentType, UserType, State, ComponentType,FuelType]),
    UserModule,
    AuthModule,
    CepModule,
    DriverModule,
    EstablishmentModule,
    VehicleModule,
    ComponentModule,
    AddressModule,
    AvaliationModule,
    FuelModule,
    ScheduleModule
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
    SeederService,
    FuelTypeSeeder
  ]
})
export class AppModule {}

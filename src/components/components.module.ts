import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'
import { Component } from './entities/component.entity'
import { ComponentType } from './entities/component.type.entity'
import { VehicleService } from 'src/vehicle/vehicle.service'
import { DriverService } from 'src/driver/driver.service'

@Module({
  imports: [TypeOrmModule.forFeature([Component , ComponentType])],
  controllers: [ComponentsController],
  providers: [ComponentsService],
  exports: [ComponentsService]
})
export class ComponentsModule {}

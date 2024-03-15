import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'
import { Component } from './entities/component.entity'
import { ComponentType } from './entities/component.type.entity'
import { VehicleService } from 'src/vehicle/vehicle.service'
import { DriverService } from 'src/driver/driver.service'
import { VehicleModule } from 'src/vehicle/vehicle.module'


@Module({
  imports: [TypeOrmModule.forFeature([Component , ComponentType]),VehicleModule],
  controllers: [ComponentsController],
  providers: [ComponentsService],
  exports: [ComponentsService]
})
export class ComponentsModule {}

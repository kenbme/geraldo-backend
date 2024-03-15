import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ComponentController} from './component.controller'
import {ComponentsService} from './component.service'
import {Component} from './entities/component.entity'
import {ComponentType} from './entities/component.type.entity'
import {VehicleModule} from '../vehicle/vehicle.module'

@Module({
  imports: [TypeOrmModule.forFeature([Component, ComponentType]), VehicleModule],
  controllers: [ComponentController],
  providers: [ComponentsService],
  exports: [ComponentsService]
})
export class ComponentModule {}

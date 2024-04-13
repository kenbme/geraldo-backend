import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ComponentController} from './component.controller'
import {ComponentService} from './component.service'
import {Component} from './entities/component.entity'
import {ComponentType} from './entities/component.type.entity'
import {VehicleModule} from '../vehicle/vehicle.module'
import { ComponentHistory } from './entities/ComponentHistory.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Component, ComponentType,ComponentHistory]), VehicleModule],
  controllers: [ComponentController],
  providers: [ComponentService],
  exports: [ComponentService]
})
export class ComponentModule {}

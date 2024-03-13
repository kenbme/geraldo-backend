import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'
import { Component } from './entities/component.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Component]), UserModule],
  controllers: [ComponentsController],
  providers: [ComponentsService],
  exports: [ComponentsService]
})
export class DriverModule {}

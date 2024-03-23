import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserModule} from '../user/user.module'
import { EstablishmentModule } from 'src/establishment/establishment.module';
import { Fuel } from './entity/fuel.entity';
import { FuelType } from './entity/fuel.type.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';

@Module({
  imports: [EstablishmentModule, UserModule, TypeOrmModule.forFeature([Fuel,FuelType])],
  providers: [FuelService],
  exports: [FuelService],
  controllers: [FuelController]
})
export class FuelModule {}

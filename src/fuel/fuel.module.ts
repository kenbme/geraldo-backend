import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { EstablishmentModule } from 'src/establishment/establishment.module';
import { Fuel } from './entities/fuel.entity';
import { FuelType } from './entities/fuel.type.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { AddressModule } from 'src/address/address.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Fuel,FuelType]),EstablishmentModule],
  providers: [FuelService],
  exports: [FuelService],
  controllers: [FuelController]
})
export class FuelModule {}

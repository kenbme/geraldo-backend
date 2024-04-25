import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {EstablishmentModule} from '../establishment/establishment.module'
import {Fuel} from './entities/fuel.entity'
import {FuelType} from './entities/fuel.type.entity'
import {FuelService} from './fuel.service'
import {FuelController} from './fuel.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Fuel, FuelType]), EstablishmentModule],
  providers: [FuelService],
  exports: [FuelService],
  controllers: [FuelController]
})
export class FuelModule {}

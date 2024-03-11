import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DriverModule } from 'src/driver/driver.module'
import { DriverService } from 'src/driver/driver.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { Vehicle } from './entities/vehicle.entity'
import { VehicleController } from './vehicle.controller'
import { VehicleService } from './vehicle.service'

@Module({
  imports: [DriverModule, UserModule, TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleService, UserService, DriverService],
  exports: [VehicleService],
  controllers: [VehicleController]
})
export class VehicleModule {}

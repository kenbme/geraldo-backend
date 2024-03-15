import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserModule} from '../user/user.module'
import {DriverController} from './driver.controller'
import {DriverService} from './driver.service'
import {Driver} from './entities/driver.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), UserModule],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService]
})
export class DriverModule {}

import {Module} from '@nestjs/common'
import {DriverService} from './driver.service'
import {DriverController} from './driver.controller'
import {Driver} from './entities/driver.entity'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserModule} from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), UserModule],
  controllers: [DriverController],
  providers: [DriverService]
})
export class DriverModule {}

import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {EstablishmentModule} from '../establishment/establishment.module'
import {UserModule} from '../user/user.module'
import {AvaliationController} from './avaliation.controller'
import {AvaliationService} from './avaliation.service'
import {Avaliation} from './entities/avaliation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Avaliation]), EstablishmentModule, UserModule],
  providers: [AvaliationService],
  exports: [AvaliationService],
  controllers: [AvaliationController]
})
export class AvaliationModule {}

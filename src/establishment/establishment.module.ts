import {Module} from '@nestjs/common'
import {EstablishmentService} from './establishment.service'
import {EstablishmentController} from './establishment.controller'
import {UserModule} from 'src/user/user.module'
import {EstablishmentTypeService} from './establishment.type.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Establishment} from './entities/establishment.entity'
import {EstablishmentType} from './entities/establishment.type.entity'
import { AddressesModule } from 'src/addresses/addresses.module'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Establishment, EstablishmentType]),AddressesModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, EstablishmentTypeService]
})
export class EstablishmentModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressModule } from '../address/address.module'
import { CepService } from '../cep/cep.service'
import { UserModule } from '../user/user.module'
import { Establishment } from './entities/establishment.entity'
import { EstablishmentType } from './entities/establishment.type.entity'
import { EstablishmentController } from './establishment.controller'
import { EstablishmentService } from './establishment.service'
import { EstablishmentTypeService } from './establishment.type.service'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Establishment, EstablishmentType]),
    AddressModule
  ],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, EstablishmentTypeService, CepService],
  exports: [EstablishmentService]
})
export class EstablishmentModule {}

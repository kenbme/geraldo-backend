import {Module} from '@nestjs/common'
import {CepModule} from 'src/cep/cep.module'
import {Address} from './entities/address.entity'
import {AddressService} from './address.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {City} from './entities/cities.entity'
import {State} from './entities/state.entity'
import {CityService} from './city.service'
import {StateService} from './state.service'

@Module({
  imports: [CepModule, TypeOrmModule.forFeature([Address, City, State])],
  providers: [AddressService, CityService, StateService],
  exports: [AddressService]
})
export class AddressModule {}

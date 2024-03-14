import {Module} from '@nestjs/common'
import {CepModule} from 'src/cep/cep.module'
import {Address} from './entities/addresses.entity'
import {AddressesService} from './addresses.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {City} from './entities/cities.entity'
import {State} from './entities/state.entity'
import {CityService} from './cities.service'
import {StateService} from './state.service'

@Module({
  imports: [CepModule, TypeOrmModule.forFeature([Address, City, State])],
  providers: [AddressesService, CityService, StateService],
  exports: [AddressesService]
})
export class AddressesModule {}

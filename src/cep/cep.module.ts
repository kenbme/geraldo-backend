import {Module} from '@nestjs/common'
import {CepController} from './cep.controller'
import {CepService} from './cep.service'

@Module({
  imports: [],
  controllers: [CepController],
  providers: [CepService],exports:[CepService]
})
export class CepModule {}

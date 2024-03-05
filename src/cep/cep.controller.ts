import {Controller, Get, Query} from '@nestjs/common'
import {CepService} from './cep.service'
import {AddressDto} from './dto/address.dto'

@Controller('')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get('find_address')
  find_address(@Query('cep') cep: string): Promise<AddressDto> {
    return this.cepService.getAddressByCep(cep)
  }
}

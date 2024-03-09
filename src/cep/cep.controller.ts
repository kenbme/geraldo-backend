import {Controller, Get, Query} from '@nestjs/common'
import {CepService} from './cep.service'
import {AddressDto} from '../shared/cep/dto/response/address.dto'

@Controller('')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get('find_address')
  async find_address(@Query('cep') cep: string): Promise<{data: AddressDto; message: string}> {
    const data = await this.cepService.getAddressByCep(cep)
    return {data, message: 'CEP encontrado'}
  }
}

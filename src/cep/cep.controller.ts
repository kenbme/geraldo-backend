import {Controller, Get, Query} from '@nestjs/common'
import {CepService} from './cep.service'

@Controller('')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get('find_address')
  async find_address(@Query('cep') cep: string) {
    const data = await this.cepService.getAddressByCep(cep)
    return {data, message: "CEP encontrado"}
  }
}

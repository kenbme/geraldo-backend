import {
  Controller,
  Get,
  Query,
  BadRequestException
} from '@nestjs/common'
import {CepService} from './cep.service'
import {AddressDto} from './dto/address.dto'

@Controller('')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get('find_address')
  find_address(@Query('cep') cep: string): Promise<AddressDto> {
    cep = cep.replace(/\D/g, '')
    if (cep === undefined || cep.trim().length !== 8) {
      throw new BadRequestException('Cep inválido')
    }
    return this.cepService.getAddressByCep(cep)
  }
}

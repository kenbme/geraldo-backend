import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { cepService } from './cep.service';
import { AddressDto } from './dto/address.dto';

@Controller('cep')
export class CepController {
  constructor(private readonly cepService: cepService) {}

  @Get(':Cep')
  find_address(@Query('cep') cep: string): Promise<AddressDto>{
    if(cep.trim().length !== 9){
      throw new BadRequestException('Cep inválido')
    }
    else{
      return this.cepService.getAddressByCep(cep)
    }
   

  }
}
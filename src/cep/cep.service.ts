import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {AddressDto} from './dto/address.dto'
import axios from 'axios'

@Injectable()
export class CepService {
  constructor() {}

  async getAddressByCep(cep: string): Promise<AddressDto> {
    if (cep === undefined || cep.trim().length !== 8) {
      throw new BadRequestException('CEP inválido')
    }
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
      timeout: 5000
    })
    if (response.data.erro) {
      throw new NotFoundException('CEP não encontrado')
    }
    const addressDto: AddressDto = {
      estado: response.data.uf,
      cidade: response.data.localidade,
      bairro: response.data.bairro,
      rua: response.data.logradouro
    }
    return addressDto
  }
}

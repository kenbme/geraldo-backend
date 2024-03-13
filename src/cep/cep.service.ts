import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {AddressDto} from '../shared/cep/dto/response/address.dto'
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
      state: response.data.uf,
      city: response.data.localidade,
      district: response.data.bairro,
      address: response.data.logradouro
    }
    return addressDto
  }
}

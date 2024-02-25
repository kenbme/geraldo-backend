import {Injectable, NotFoundException} from '@nestjs/common'
import {AddressDto} from './dto/address.dto'
import axios from 'axios'

@Injectable()
export class CepService {
  constructor() {}

  async getAddressByCep(cep: string): Promise<AddressDto> {
    cep = cep.replace(/\D/g, '')
    const response = await axios.get(
      `https://viacep.com.br/ws/${cep}/json/`
    )
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

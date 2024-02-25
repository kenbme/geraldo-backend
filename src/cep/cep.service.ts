import {Injectable} from '@nestjs/common'
import {AddressDto} from './dto/address.dto'
import axios from 'axios'


@Injectable()
export class CepService {
  constructor(){}
  
  async getAddressByCep(cep: string): Promise<AddressDto> {
    
    cep = cep.replace(/\D/g, '');
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    } else {
      const addressDto: AddressDto = {
        estado: response.data.uf,
        cidade: response.data.localidade,
        bairro: response.data.bairro,
        rua: response.data.logradouro,
      };
      return addressDto;
    }
  }
}

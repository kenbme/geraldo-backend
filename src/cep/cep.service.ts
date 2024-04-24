import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { AddressDto } from '../shared/cep/dto/response/address.dto'
import axios from 'axios'

@Injectable()
export class CepService {
  constructor() { }

  async getAddressByCep(cep: string): Promise<AddressDto> {
    if (cep === undefined || cep.trim().length !== 8) {
      throw new BadRequestException('CEP inválido')
    }
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, { timeout: 5000 })
    if (response.data.erro) {
      throw new NotFoundException('CEP não encontrado')
    }
    if (!response.data.logradouro) {
      throw new ForbiddenException('CEP inválido')
    }
    const addressDto: AddressDto = {
      state: response.data.uf,
      city: response.data.localidade,
      district: response.data.bairro,
      address: response.data.logradouro
    }
    return addressDto
  }

  async getLatitudeAndLongitude(street: string, houseNumber: string): Promise<{ latitude: number; longitude: number }> {
    const apiKey = 'AIzaSyCBNSMSaW344jow4JOFMKsbUO8f4FqO7tk'
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street + ", " + houseNumber)}&key=${apiKey}`
    try {
      const response = await axios.get(apiUrl, { timeout: 5000 })
      const { data } = response
      if (data.results && data.results.length > 0) {
        const { formatted_address, geometry } = data.results[0]
        const { lat, lng } = geometry.location
        return { latitude: lat, longitude: lng }
      } else {
        throw new NotFoundException('Endereço não encontrado.')
      }
    } catch (error) {
      throw new InternalServerErrorException('Erro ao consultar a API de geocodificação:', error)
    }
  }
}
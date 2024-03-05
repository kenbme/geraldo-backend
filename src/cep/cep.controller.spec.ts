import {Test, TestingModule} from '@nestjs/testing'
import {CepController} from './cep.controller'
import {CepService} from './cep.service'
import {BadRequestException, NotFoundException} from '@nestjs/common'

describe('cepController', () => {
  let cepController: CepController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CepController],
      providers: [CepService]
    }).compile()

    cepController = module.get(CepController)
  })

  it('should be defined', () => {
    expect(cepController).toBeDefined()
  })

  it('should be Monteiro', async () => {
    const res = await cepController.find_address('58500-000')
    expect(res).toBeDefined()
    expect(res).toEqual({estado: 'PB', cidade: 'Monteiro', bairro: '', rua: ''})
  })

  it('should be Universitario CG', async () => {
    const res = await cepController.find_address('58429-900')
    expect(res).toBeDefined()
    expect(res).toEqual({
      estado: 'PB',
      cidade: 'Campina Grande',
      bairro: 'Universitário',
      rua: 'Rua Aprígio Veloso'
    })
  })

  it('CEP exceeds maximum length', async () => {
    try {
      await cepController.find_address('58429-9000000000')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
      return
    }
    fail()
  })

  it('CEP does not reach the minimum size', async () => {
    try {
      await cepController.find_address('58')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
      return
    }
    fail()
  })

  it('CEP should not pass without hifen', async () => {
    try {
      await cepController.find_address('58500000')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
      return
    }
    fail()
  })

  it('CEP not found', async () => {
    try {
      await cepController.find_address('00000-000')
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException)
      return
    }
    fail()
  })
})

import {Test, TestingModule} from '@nestjs/testing'
import {DriverController} from './driver.controller'
import {DriverService} from './driver.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Driver} from './entities/driver.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {User} from 'src/user/entities/user.entity'
import {UserModule} from 'src/user/user.module'
import {ConflictException} from '@nestjs/common'
import {ValidationError, validateOrReject} from 'class-validator'
import {CreateDriverDto} from '../shared/driver/dto/request/create-driver.dto'

describe('DriverController', () => {
  let driverController: DriverController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_driver.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Driver]
        }),
        TypeOrmModule.forFeature([Driver]),
        UserModule
      ],
      controllers: [DriverController],
      providers: [DriverService]
    }).compile()

    driverController = module.get<DriverController>(DriverController)
  })

  it('should be defined', () => {
    expect(driverController).toBeDefined()
  })

  it('should create driver', async () => {
    const driver = await driverController.create({
      username: '22222222222',
      email: 'teste@gmail.com',
      birthday: '2002-12-15',
      name: 'fulano'
    })
    expect(driver).toBeDefined()
    expect(driver.data.name).toEqual('fulano')
  })

  describe('isValidEmail', () => {
    it('email exist', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: 'teste@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
        await driverController.create({
          username: '11222222211',
          email: 'teste@gmail.com',
          birthday: '2002-12-15',
          name: 'ciclano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      throw new Error()
    })
    it('email invalid because is empty', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = ''
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isNotEmpty).toEqual('O email não pode ser vazio')
          return
        }
      }
      throw new Error()
    })
    it('email invalid because is blank', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = '               '
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isEmail).toEqual('O email deve ser um email válido')
          return
        }
      }
      throw new Error()
    })
    it('email invalid because not contains @', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'testesgmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isEmail).toEqual('O email deve ser um email válido')
          return
        }
      }
      throw new Error()
    })

    it('email invalid because is specials character invalid ', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = '..teste#@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isEmail).toEqual('O email deve ser um email válido')
          return
        }
      }
      throw new Error()
    })
  })

  describe('isValidUserName', () => {
    it('username exist', async () => {
      try {
        await driverController.create({
          username: '22222222222',
          email: 'teste2@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
        await driverController.create({
          username: '22222222222',
          email: 'teste1@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      throw new Error()
    })
    it('username invalid because is empty', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = ''
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isNotEmpty).toEqual('o cpf não pode ser vazio')
          return
        }
      }
      throw new Error()
    })
    it('username exceeds maximum length', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '1234567891123'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.maxLength).toEqual('o cpf não deve exceder 11 caracteres')
          return
        }
      }
      throw new Error()
    })
    it('username does not reach the minimum size', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '1234'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'beltrano'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.minLength).toEqual('o cpf deve ter 11 caracteres')
          return
        }
      }
      throw new Error()
    })
  })
  describe('isValidName', () => {
    it('name invalid because is empty', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = ''
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isNotEmpty).toEqual('O nome não pode ser vazio')
          return
        }
      }
      throw new Error()
    })

    it('name invalid because is blank', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = '        '
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          console.log(err.constraints.minLength)

          expect(err.constraints.isNotEmpty).toEqual('O nome não pode ser vazio')
          return
        }
      }
      throw new Error()
    })
    it('name invalid because contains specials character ', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 't&st&'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isString).toEqual('O nome deve ser válido')
          return
        }
      }
      throw new Error()
    })
    it('name does not reach the minimum size', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2002-12-15'
        dto.name = 'ze'
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.minLength).toEqual('o nome deve ter mais que 4 caracteres')
          return
        }
      }
      throw new Error()
    })
  })

  describe('isValidBirthday', () => {
    it('birthday invalid because is empty', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = ''
        dto.name = 'ciclano '
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.isNotEmpty).toEqual('A data de nascimento não pode ser vazia')
          return
        }
      }
      throw new Error()
    })
    it('birthday does reach the maximum age permitted', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '1910-01-01'
        dto.name = 'ciclano '
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.minDate).toEqual('Data de nascimento não permitida')
          return
        }
      }
      throw new Error()
    })
    it('birthday does not reach the minimum age permitted', async () => {
      try {
        const dto = new CreateDriverDto()
        dto.username = '10137419430'
        dto.email = 'teste@gmail.com'
        dto.birthday = '2010-01-01'
        dto.name = 'ciclano '
        await validateOrReject(dto)
      } catch ([err]) {
        if (err instanceof ValidationError && err.constraints) {
          expect(err.constraints.maxDate).toEqual('Data de nascimento não permitida')
          return
        }
      }
      throw new Error()
    })
  })
})

import {Test, TestingModule} from '@nestjs/testing'
import {DriverController} from './driver.controller'
import {DriverService} from './driver.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Driver} from './entities/driver.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {User} from 'src/user/entities/user.entity'
import {UserModule} from 'src/user/user.module'
import {Catch, ConflictException} from '@nestjs/common'

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
    expect(driver.user.name).toEqual('fulano')
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
      fail()
    })
    it('email invalid because is empty', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: '',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('email invalid because not contains @', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: 'testegmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('email invalid because is blank', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: '          ',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('email invalid because is specials character invalid ', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: '..teste#@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
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
      fail()
    })
    it('username invalid because is empty', async () => {
      try {
        await driverController.create({
          username: '',
          email: 'teste3@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('username exceeds maximum length', async () => {
      try {
        await driverController.create({
          username: '22222222221111111',
          email: 'teste3@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('username does not reach the minimum size', async () => {
      try {
        await driverController.create({
          username: '11111',
          email: 'teste5@gmail.com',
          birthday: '2002-12-15',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
  })
  describe('isValidName', () => {
    it('name invalid because is empty', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: 'teste5@gmail.com',
          birthday: '2002-12-15',
          name: ''
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })

    it('name invalid because is blank', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: 'teste5@gmail.com',
          birthday: '2002-12-15',
          name: '        '
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('name invalid because contains specials character ', async () => {
      try {
        await driverController.create({
          username: '22222222211',
          email: 'teste1@gmail.com',
          birthday: '2002-12-15',
          name: 'beltran@'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('name does not reach the minimum size', async () => {
      try {
        await driverController.create({
          username: '11111',
          email: 'teste5@gmail.com',
          birthday: '2002-12-15',
          name: 'ana'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
  })
  describe('isValidBirthday', () => {
    it('birthday invalid because is empty', async () => {
      try {
        await driverController.create({
          username: '12345678901',
          email: 'teste3@gmail.com',
          birthday: '',
          name: 'beltrano'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('birthday does reach the maximum age permitted', async () => {
      try {
        await driverController.create({
          username: '22222222221111111',
          email: 'teste3@gmail.com',
          birthday: '1910-12-15',
          name: 'beltrano velho'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
    it('birthday does not reach the minimum age permitted', async () => {
      try {
        await driverController.create({
          username: '11111',
          email: 'teste5@gmail.com',
          birthday: '2015-12-15',
          name: 'beltrano jr'
        })
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        return
      }
      fail()
    })
  })
})

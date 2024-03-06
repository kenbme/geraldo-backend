import {Test, TestingModule} from '@nestjs/testing'
import {DriverController} from './driver.controller'
import {DriverService} from './driver.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Driver } from './entities/driver.entity'
import { UserType } from 'src/user/entities/user.type.entity'
import { User } from 'src/user/entities/user.entity'
import { UserModule } from 'src/user/user.module'

describe('DriverController', () => {
  let controller: DriverController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db/testing.sqlite3',
        synchronize: true,
        entities: [User, UserType, Driver]
      }), TypeOrmModule.forFeature([Driver]), UserModule],
      controllers: [DriverController],
      providers: [DriverService]
    }).compile()

    controller = module.get<DriverController>(DriverController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

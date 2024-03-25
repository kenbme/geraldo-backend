import { Test, TestingModule } from '@nestjs/testing';
import { FuelController } from './fuel.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {Establishment} from 'src/establishment/entities/establishment.entity'
import {Fuel} from './entities/fuel.entity'
import {FuelType} from './entities/fuel.type.entity'
import {FuelService} from './fuel.service'
import {EstablishmentModule} from 'src/establishment/establishment.module'
import {UserModule} from 'src/user/user.module'
import {UserTypeSeeder} from 'src/user/seeders/user.type.seeder'
import {FuelTypeEnum} from 'src/shared/fuel/enum/fuel.type.enum'
import {ValidationError, validateOrReject} from 'class-validator'
import { FuelTypeSeeder } from './seeders/fuel.type.seeder';
import { EstablishmentService } from 'src/establishment/establishment.service';
import { EstablishmentTypeEnum } from 'src/shared/establishment/enums/establishment-type.enum';
import { EstablishmentType } from 'src/establishment/entities/establishment.type.entity';
import { Address } from 'src/address/entities/address.entity';
import { City } from 'src/address/entities/cities.entity';
import { State } from 'src/address/entities/state.entity';
import { EstablishmentTypeSeeder } from 'src/establishment/seeders/establishment.type.seeder';
import { StateSeeder } from 'src/address/seeders/state.seeder';

describe('FuelController', () => {
  let fuelController: FuelController
  let fuelService: FuelService
  let estabelecimento: Establishment

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_fuel.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Establishment,EstablishmentType,Address,City,State, Fuel, FuelType]
        }),
        UserModule,
        EstablishmentModule,
        TypeOrmModule.forFeature([User, UserType, Establishment, Fuel, FuelType,EstablishmentType,Address,City,State])
      ],
      controllers: [FuelController],
      providers: [FuelService, FuelTypeSeeder, UserTypeSeeder,EstablishmentTypeSeeder,StateSeeder]
    }).compile()

    fuelController = module.get(FuelController)
    fuelService = module.get(FuelService)

    const seeder = module.get(FuelTypeSeeder)
    await seeder.seed()
    const establishmentTypeSeeder = module.get(EstablishmentTypeSeeder)
    await establishmentTypeSeeder.seed()
    const stateSeeder = module.get(StateSeeder)
    await stateSeeder.seed()
    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()
    const establishmentService = module.get(EstablishmentService)
    estabelecimento = await establishmentService.create({
        username: "12345678000123",
        name: "Posto de Combustível XYZ",
        email: "postoxyz@example.com",
        establishmentType: EstablishmentTypeEnum.GAS_STATION,
        areaCode: "11",
        phone: "987654321",
        postalCode: "58429170",
        houseNumber: "123"
      })
      
    })
    it('should be defined', () => {
      expect(fuelController).toBeDefined()
      expect(fuelService).toBeDefined()
    })
  
    it('should create a fuel', async () => {
     const dto = await fuelService.create(
        {
          fuelType: FuelTypeEnum.GASOLINE,
          fuelTitle: "Gasolina Comum",
          value: 5.99,
          productStatus: true
        },estabelecimento.user.id)
  })
  it('Estabelecimento not found', async () => {
    try {
     const dto = await fuelService.create(
        {
          fuelType: FuelTypeEnum.GASOLINE,
          fuelTitle: "Gasolina Comum",
          value: 5.99,
          productStatus: true
        },111)
    } catch (error) {
      expect(error.message).toEqual(
        'Estabelecimento não encontrado'
      )
      return
    }
    throw new Error()
  })
  it('should update a fuel', async () => {
    const createdFuel = await fuelService.create(
      {
        fuelType: FuelTypeEnum.GASOLINE,
        fuelTitle: "Gasolina Comum",
        value: 5.99,
        productStatus: true
      },
      estabelecimento.user.id
   );

   const updatedFuel = await fuelService.update(
       estabelecimento.user.id, 
       createdFuel.id,
       {
           fuelType: FuelTypeEnum.GASOLINE,
           fuelTitle: "Gasolina Comum",
           value: 7.11,
           productStatus: true
       }
   );

   // Verificar se os dados do combustível foram atualizados corretamente
   expect(updatedFuel.value).toBe(7.11)
      
 })
 it('update fuel not exists in establishment', async () => {
  try {
    const createdFuel = await fuelService.create(
      {
        fuelType: FuelTypeEnum.GASOLINE,
        fuelTitle: "Gasolina Comum",
        value: 5.99,
        productStatus: true
      },
      estabelecimento.user.id
   );
  
   const updatedFuel = await fuelService.update(
       estabelecimento.user.id, 
       2,
       {
           fuelType: FuelTypeEnum.GASOLINE,
           fuelTitle: "Gasolina Comum",
           value: 7.11,
           productStatus: true
       }
   );
  
  } catch (error) {
    expect(error.message).toEqual(
      'O estabelecimento não possui permissão para alterar esse combustível'
    )
  }
    
})
it('update  not exists establishment', async () => {
  try {
    
   const updatedFuel = await fuelService.update(
       2, 
       1,
       {
           fuelType: FuelTypeEnum.GASOLINE,
           fuelTitle: "Gasolina Comum",
           value: 7.11,
           productStatus: true
       }
   );
  
  } catch (error) {
    expect(error.message).toEqual(
      'Estabelecimento não encontrado'
    )
  }
    
})
    
})

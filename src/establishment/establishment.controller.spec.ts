import {Test, TestingModule} from '@nestjs/testing'
import {EstablishmentController} from './establishment.controller'
import {EstablishmentService} from './establishment.service'
import {TypeOrmModule, getRepositoryToken} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'
import {UserType} from 'src/user/entities/user.type.entity'
import {Establishment} from './entities/establishment.entity'
import {UserModule} from 'src/user/user.module'
import {EstablishmentType} from './entities/establishment.type.entity'
import {EstablishmentTypeService} from './establishment.type.service'
import {Repository} from 'typeorm'
import {AddressModule} from 'src/address/address.module'
import {Address} from 'src/address/entities/address.entity'
import {State} from 'src/address/entities/state.entity'
import {City} from 'src/address/entities/cities.entity'
import {EstablishmentTypeSeeder} from './seeders/establishment.type.seeder'
import {StateSeeder} from 'src/address/seeders/state.seeder'
import {UserTypeSeeder} from 'src/user/seeders/user.type.seeder'
import {EstablishmentTypeEnum} from 'src/shared/establishment/enums/establishment-type.enum'
import { UpdateEstablishmentDto } from 'src/shared/establishment/dto/request/update-establishment.dto'
import { CreateEstablishmentDto } from 'src/shared/establishment/dto/request/create-establishment.dto'
import { EstablishmentResponseDTO } from 'src/shared/establishment/dto/response/establishment.response.dto'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { FuelType } from 'src/fuel/entities/fuel.type.entity'
import { Schedule } from 'src/schedule/entities/schedule.entity'
import { Shift } from 'src/schedule/entities/shift.entity'

describe('EstablishmentController', () => {
  let establishmentController: EstablishmentController
  let establishmentService: EstablishmentService
  let userRepository: Repository<User>
  let establishmentFromController: {
    data: EstablishmentResponseDTO;
    message: string;
  }
  let establishmentFromService: Establishment

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_establishment.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [User, UserType, Establishment, EstablishmentType, Address, State, City, Fuel, FuelType, Schedule, Shift]
        }),
        TypeOrmModule.forFeature([Establishment, EstablishmentType, State, UserType, User]),
        UserModule,
        AddressModule
      ],
      controllers: [EstablishmentController],
      providers: [
        EstablishmentService,
        EstablishmentTypeService,
        {provide: getRepositoryToken(User), useClass: Repository},
        EstablishmentTypeSeeder,
        StateSeeder,
        UserTypeSeeder
      ]
    }).compile()
    establishmentController = module.get(EstablishmentController)
    userRepository = module.get(getRepositoryToken(User))
    establishmentService = module.get(EstablishmentService)
    await userRepository.clear()
    const establishmentTypeSeeder = module.get(EstablishmentTypeSeeder)
    await establishmentTypeSeeder.seed()
    const stateSeeder = module.get(StateSeeder)
    await stateSeeder.seed()
    const userTypeSeeder = module.get(UserTypeSeeder)
    await userTypeSeeder.seed()

    establishmentFromController = await establishmentController.create({
      username: '96202717000195',
      email: 'teste@gmail.com',
      name: 'fulano',
      areaCode: '83',
      phone: '83993333333',
      establishmentType: EstablishmentTypeEnum.GAS_STATION,
      houseNumber: '15',
      postalCode: '58429900'
    })

    establishmentFromService = await establishmentService.create({
      username: '52785209000101',
      email: 'teste2@gmail.com',
      name: 'ciclano',
      areaCode: '83',
      phone: '83993333331',
      establishmentType: EstablishmentTypeEnum.GAS_STATION,
      houseNumber: '10',
      postalCode: '29043180'
      })
  })

  it('should be defined', () => {
    expect(establishmentController).toBeDefined()
  })

  it('should create a establishment', async () => {
    expect(establishmentFromController).toBeDefined()
    expect(establishmentFromService).toBeDefined()
  })

  it('should update a establishment', async () => {
    const updateDto: UpdateEstablishmentDto = {
      name: 'Beltrano',
      email: 'beltrano@gmail.com',
      areaCode: '81',
      phone: '81995554444',
      postalCode: '73381092',
      houseNumber: '20'
    };
    const updatedEstablishment = await establishmentService.updateEstablishment(
    establishmentFromService.user.id,
    updateDto)
    
    expect(updatedEstablishment).toBeDefined();  
    expect(updatedEstablishment.user).toBeDefined();
    expect(updatedEstablishment.address).toBeDefined();
    expect(updatedEstablishment.areaCode).toBe(updateDto.areaCode)
    expect(updatedEstablishment.phone).toBe(updateDto.phone);
    expect(updatedEstablishment.address.houseNumber).toBe(updateDto.houseNumber);
    expect(updatedEstablishment.address.postalCode).toBe(updateDto.postalCode);
    expect(updatedEstablishment.user.email).toBe(updateDto.email);
    expect(updatedEstablishment.user.name).toBe(updateDto.name);
  });

  it('should update a establishment by Controller', async () => {
    const updateDto: UpdateEstablishmentDto = {
      name: 'Beltrano',
      email: 'beltrano@gmail.com',
      areaCode: '83',
      phone: '83995554444',
      postalCode: '73381092',
      houseNumber: '20'
    };
    const request: any = {user: {id: establishmentFromService.user.id}}
    const updatedEstablishment = await establishmentController.updateEstablishment(
    request, updateDto)
    expect(updatedEstablishment).toBeDefined();
    expect(updatedEstablishment.message).toEqual('Estabelecimento atualizado com sucesso')
  })

  it('should create another establishment with already used cep', async() => {
    await establishmentService.create({
      username: '11564764000126',
      email: 'teste4444@gmail.com',
      name: 'sicranin',
      areaCode: '83',
      phone: '83994444444',
      establishmentType: EstablishmentTypeEnum.GAS_STATION,
      houseNumber: '11',
      postalCode: '29043180'
      })
  })

  it('should get all establishments from city', async() => {
    const res = await establishmentController.getEstablishments(establishmentFromService.address.city.id + "")
    expect(res.message).toBe('Lista de estabelecimentos')
    expect(res.data.length).toBeGreaterThan(0)
  })
})

/*import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverService } from 'src/driver/driver.service';
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto';
import { UserModule } from 'src/user/user.module';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
describe('VehicleController', () => {
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db/testing_establishment.sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [Vehicle]
        }),
        TypeOrmModule.forFeature([Vehicle]),
        UserModule
      ],
      controllers: [VehicleController],
      providers: [VehicleService, DriverService],
    }).compile();
  
    vehicleController = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
  });
  
  it('should create a vehicle', async () => {
    const createVehicleDto: CreateVehicleDto = {
      kilometers: 10000,
      model: 'Onix',
      year: 2002,
      plate: 'AAAA-1010',
    };

    const driverId = 1;
    const createdVehicle = await vehicleController.create({ createVehicleDto, driverId });

    expect(createdVehicle).toBeDefined();
    expect(createdVehicle.data.model).toEqual('Onix');
  });
});
*/

import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsController } from './components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserType } from 'src/user/entities/user.type.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Component } from './entities/component.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ComponentsService } from './components.service';
import { ComponentType } from './entities/component.type.entity';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { DriverModule } from 'src/driver/driver.module';
import { UserModule } from 'src/user/user.module';

describe('ComponentsController', () => {
  let controller: ComponentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db/testing_establishment.sqlite3',
        synchronize: true,
        dropSchema: true,
        entities: [User, UserType, Driver, Vehicle, Component, ComponentType]
      }),
        UserModule,
        DriverModule,
        VehicleModule,
      TypeOrmModule.forFeature([Driver, Vehicle, Component, ComponentType])],
      controllers: [ComponentsController],
      providers: [ComponentsService]
    }).compile();

    controller = module.get<ComponentsController>(ComponentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

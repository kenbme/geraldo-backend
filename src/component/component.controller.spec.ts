import { Test, TestingModule } from '@nestjs/testing';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserType } from 'src/user/entities/user.type.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Component } from './entities/component.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ComponentsService } from './component.service';
import { ComponentType } from './entities/component.type.entity';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { DriverModule } from 'src/driver/driver.module';
import { UserModule } from 'src/user/user.module';

describe('ComponentController', () => {
  let controller: ComponentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db/testing_component.sqlite3',
        synchronize: true,
        dropSchema: true,
        entities: [User, UserType, Driver, Vehicle, Component, ComponentType]
      }),
        UserModule,
        DriverModule,
        VehicleModule,
      TypeOrmModule.forFeature([Driver, Vehicle, Component, ComponentType])],
      controllers: [ComponentController],
      providers: [ComponentsService]
    }).compile();

    controller = module.get<ComponentController>(ComponentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

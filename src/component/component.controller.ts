import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CreateComponentDto } from '../shared/component/dto/request/create-component'
import { ComponentResponseDTO } from '../shared/component/dto/response/component.response.dto'
import { createComponentResponseDTO } from '../util/mapper'
import { ComponentService } from './component.service'
import { VehicleService } from 'src/vehicle/vehicle.service'
import { Component } from './entities/component.entity'
import { UUID } from 'crypto'


@Controller('components')
export class ComponentController {
  constructor(private readonly componentsService: ComponentService,
    private readonly vehicleService: VehicleService
  ) { }

  @Post('/vehicle_components')
  @HttpCode(200)
  async create(
    @Body() createComponentsDTO: CreateComponentDto
  ): Promise<{ data: ComponentResponseDTO; message: string }> {
    const component = await this.componentsService.create(createComponentsDTO)
    const data = createComponentResponseDTO(component)
    return { data, message: 'Componente cadastrado com sucesso' }
  }

  @Get('/vehicle_components/:vehicleId')
  async list(
    @Param('vehicleId') vehicleId: UUID,
  ): Promise<Component[]> {
    return await this.vehicleService.listComponentsByVehicleId(vehicleId);
  }
 

    }

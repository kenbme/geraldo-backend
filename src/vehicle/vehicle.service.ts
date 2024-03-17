import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { DriverService } from '../driver/driver.service'
import { CreateVehicleDto } from '../shared/vehicle/dto/request/create-vehicle.dto'
import { EntityNotFoundError, Repository } from 'typeorm'
import { Vehicle } from './entities/vehicle.entity'
import { Component } from 'src/component/entities/component.entity'
import { ComponentService } from 'src/component/component.service'

@Injectable()
export class VehicleService {
  constructor(
    private readonly driverService: DriverService,
    private readonly componentService: ComponentService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>
  ) { }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    if (await this.existsPlate(createVehicleDto.plate)) {
      if (await this.isOwner(createVehicleDto.plate, createVehicleDto.driverId)) {
        throw new ConflictException('Veículo já encontra-se cadastrado')
      }
      throw new ConflictException('Veículo pertence a outro motorista')
    }
    const vehicle = new Vehicle()
    vehicle.model = createVehicleDto.model
    vehicle.plate = createVehicleDto.plate
    vehicle.kilometers = createVehicleDto.kilometers
    vehicle.year = createVehicleDto.year
    const owner = await this.driverService.findById(createVehicleDto.driverId)
    vehicle.owners = [owner]
    return await this.vehicleRepository.save(vehicle)
  }

  async existsPlate(targetPlate: string): Promise<Boolean> {
    const vehicle = await this.vehicleRepository.findOneBy({ plate: targetPlate })
    if (vehicle !== null) {
      return true
    }
    return false
  }

  async isOwner(targetPlate: string, driverId: UUID): Promise<boolean> {
    const vehicleUsed = await this.vehicleRepository.findOneBy({ plate: targetPlate })
    const driver = await this.driverService.findById(driverId)
    if (vehicleUsed !== null) {
      if (vehicleUsed.owners.includes(driver)) {
        return true
      }
    }
    return false
  }

  async getVehicles(driverId: UUID): Promise<Vehicle[]> {
    try {
      const driver = await this.driverService.findById(driverId)
    } catch (error) {
      throw new NotFoundException("Motorista não encontrado")
    }
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owners', 'driver')
      .where('driver.id = :driverId', { driverId: driverId })
      .getMany()
    if (!vehicles || vehicles.length === 0) {
      throw new NotFoundException('Nenhum veículo encontrado para este motorista.')
    }
    console.log(vehicles)
    return vehicles
  }

  async findById(id: UUID): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOneBy({ id: id })
    if (vehicle === null) {
      throw new NotFoundException('Nenhum veículo')
    }
    return vehicle
  }

  async listComponentsByVehicleId(vehicleId: UUID): Promise<Component[]> {
    const vehicle = await this.findById(vehicleId)
    return vehicle.components;
  }


  async deleteComponentFromVehicle(driverId: UUID, componentId: UUID, vehicleId: UUID) {
    const vehicle = await this.findById(vehicleId)
    if (!this.ownsVehicle(driverId, vehicle.id)) {
      throw new UnauthorizedException('Veículo informado não pertence ao motorista');
    }
    const componentIndex = vehicle.components.findIndex(component => component.id === componentId);
    if (componentIndex === -1) {
      throw new NotFoundException('Componente não encontrado neste veículo');
    }
    await this.componentService.deleteComponent(componentId)
    vehicle.components.splice(componentIndex, 1);
  }

  async ownsVehicle(driverID: UUID, vehicleId: UUID): Promise<boolean> {
    const driver = await this.driverService.findById(driverID)
    const ownedVehicles = await this.ownedVehicles(driverID);
    const vehicleExists = ownedVehicles.some(vehicle => vehicle.id === vehicleId);
    return vehicleExists;
  }

  async ownedVehicles(driverID: UUID): Promise<Vehicle[]> {
    const driver = await this.driverService.findById(driverID)
    return this.driverService.getAllVehicles(driver);
  }
}

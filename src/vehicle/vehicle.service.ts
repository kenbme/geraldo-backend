import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { DriverService } from '../driver/driver.service'
import { CreateVehicleDto } from '../shared/vehicle/dto/request/create-vehicle.dto'
import { Vehicle } from './entities/vehicle.entity'

@Injectable()
export class VehicleService {
  constructor(
    private readonly driverService: DriverService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>
  ) {}

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
    const vehicle = await this.vehicleRepository.findOneBy({plate: targetPlate})
    if (vehicle !== null) {
      return true
    }
    return false
  }

  async isOwner(targetPlate: string, driverId: UUID): Promise<boolean> {
    const vehicleUsed = await this.vehicleRepository.findOneBy({plate: targetPlate})
    const driver = await this.driverService.findById(driverId)
    if (vehicleUsed !== null && driver !== null) {
      for(let a =0;a < vehicleUsed.owners.length;a++){
        if(vehicleUsed.owners[a].id === driverId){
          return true
        }
      }
    }
    return false
  }

  async getVehicles(driverId: UUID): Promise<Vehicle[]> {
    try {
      await this.driverService.findById(driverId)
    } catch (error) {
      throw new NotFoundException('Motorista não encontrado')
    }
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owners', 'driver')
      .where('driver.id = :driverId', {driverId: driverId})
      .getMany()
    return vehicles
  }

  async findById(id: UUID): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {id: id},
      relations: {components: true, owners: true}
    })
    if (!vehicle) {
      throw new NotFoundException('Nenhum veículo')
    }
    return vehicle
  }
}

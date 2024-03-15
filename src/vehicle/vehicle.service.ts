import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from 'crypto'
import { DriverService } from 'src/driver/driver.service'
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto'
import { Repository } from 'typeorm'
import { Vehicle } from './entities/vehicle.entity'

@Injectable()
export class VehicleService {

  constructor(
    private readonly driverService: DriverService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>
  ) {}
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    if (await this.existPlate(createVehicleDto.plate)) {
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
    vehicle.owners.push(owner)
    return this.vehicleRepository.save(vehicle)
  }
  async existPlate(placaAlvo: string): Promise<Boolean> {
    const vehicle = this.vehicleRepository.findOneBy({plate: placaAlvo})
    if (vehicle !== undefined) {
      return true
    }
    return false
  }
  async isOwner(targetplate: string, driverId: UUID): Promise<boolean> {
    const vehicleUsed = await this.vehicleRepository.findOneBy({plate: targetplate})
    const driver = await this.driverService.findById(driverId)
    if (vehicleUsed !== null) {
      if (vehicleUsed.owners.includes(driver)) {
        return true
      }
    }
    return false
  }

  async getVehicles(driver_UUid: UUID): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.createQueryBuilder("vehicle").leftJoinAndSelect('vehicle.owners', 'driver')
    .where('driver.uuid = :driverUUId', { driver_UUid })
    .getMany();
    if (!vehicles || vehicles.length === 0) {
      throw new NotFoundException('Nenhum veículo encontrado para este motorista.')
    }

    return vehicles;
  }
  async getVehicle(id: UUID): Promise<Vehicle> { 
    return await this.vehicleRepository.findOneByOrFail({id: id}) 
  }
}
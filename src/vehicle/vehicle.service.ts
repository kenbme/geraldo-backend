import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID, randomUUID } from 'crypto'
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
  async create(userUUid: UUID, createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    if (await this.existPlate(createVehicleDto.plate)) {
      if (await this.isOwner(createVehicleDto.plate, userUUid)) {
        throw new ConflictException('Veículo já encontra-se cadastrado')
      }
      throw new ConflictException('Veículo pertence a outro motorista')
    }
    const vehicle = new Vehicle()
    vehicle.uuid = randomUUID()
    vehicle.model = createVehicleDto.model
    vehicle.plate = createVehicleDto.plate
    vehicle.kilometers = createVehicleDto.kilometers
    vehicle.year = createVehicleDto.year
    const owner = await this.driverService.findByUUid(userUUid)
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
  async isOwner(targetplate: string, driverUUid: UUID): Promise<boolean> {
    const vehicleUsed = await this.vehicleRepository.findOneBy({plate: targetplate})
    const driver = await this.driverService.findByUUid(driverUUid)
    if (vehicleUsed !== null) {
      if (vehicleUsed.owners.includes(driver)) {
        return true
      }
    }
    return false
  }
}

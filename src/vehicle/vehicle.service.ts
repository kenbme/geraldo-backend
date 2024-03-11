import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { Driver } from 'src/driver/entities/driver.entity'
import { CreateVehicleDto } from 'src/shared/vehicle/dto/request/create-vehicle.dto'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Vehicle } from './entities/vehicle.entity'

@Injectable()
export class VehicleService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) {}
  async create(userId: number,createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    if (await this.existePlaca(createVehicleDto.plate)){
        throw new ConflictException('Veículo já encontra-se cadastrado')
    }
    const vehicle = new Vehicle()
    vehicle.uuid = randomUUID()
    vehicle.model = createVehicleDto.model
    vehicle.plate = createVehicleDto.plate
    vehicle.kilometers = createVehicleDto.kilometers
    vehicle.year = createVehicleDto.year
    const owner = await this.driverRepository.findOneByOrFail({id:userId})
    vehicle.owners.push(owner);
    return this.vehicleRepository.save(vehicle)
  }
  async existePlaca(placaAlvo:string):Promise<Boolean>{
    const vehicle = this.vehicleRepository.findOneBy({plate:placaAlvo})
    if(vehicle === undefined){return true}
    return false
  }
}

import {ConflictException, Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UUID} from 'crypto'
import {DriverService} from '../driver/driver.service'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {Repository} from 'typeorm'
import {Vehicle} from './entities/vehicle.entity'
import { UserService } from 'src/user/user.service'
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum'
import { ShareVehicleDto } from 'src/shared/vehicle/dto/request/share-vehicle.dto'

@Injectable()
export class VehicleService {
  constructor(
    private readonly driverService: DriverService,
    private readonly userService: UserService,
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
    if (vehicleUsed !== null) {
      if (vehicleUsed.owners.includes(driver)) {
        return true
      }
    }
    return false
  }

  async getVehicles(driverId: UUID): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owners', 'driver')
      .where('driver.id = :driverId', {driverId: driverId})
      .getMany()
    if (!vehicles || vehicles.length === 0) {
      throw new NotFoundException('Nenhum veículo encontrado para este motorista.')
    }
    return vehicles
  }

  async findById(id: UUID): Promise<Vehicle> {
    return await this.vehicleRepository.findOneByOrFail({id: id})
  }

  async shareVehicle(vehicleId: UUID, vehicleOwnerId: UUID, shareVehicleDto: ShareVehicleDto): Promise<Vehicle>{
    const vehicle = this.vehicleRepository.findOneByOrFail({id: vehicleId})
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const plate = (await vehicle).plate
    if(!this.isOwner(plate, vehicleOwnerId)){
      throw new NotFoundException('Motorista não encontrado');
    }

    const newOwner = this.driverService.findByUserName(shareVehicleDto.cpf)
    if (!newOwner) {
      throw new NotFoundException('Motorista não encontrado');
    }

    const alreadyAssociated = (await vehicle).owners.some(owner => owner.user.username === shareVehicleDto.cpf);
    if (alreadyAssociated) {
      throw new ConflictException('Motorista já está associado ao veículo');
    }
    
    (await vehicle).owners.push(await newOwner)

    return vehicle;
  }
}

import {BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UUID} from 'crypto'
import {DriverService} from '../driver/driver.service'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {Repository} from 'typeorm'
import {Vehicle} from './entities/vehicle.entity'
import { UserService } from 'src/user/user.service'
import { ShareVehicleDto } from 'src/shared/vehicle/dto/request/share-vehicle.dto'
import { UpdateKilometersDto } from 'src/shared/vehicle/dto/request/update-kilometers.dto'

@Injectable()
export class VehicleService {
  constructor(
    private readonly driverService: DriverService,
    private readonly userService: UserService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>
  ) {}

  async create(driverId: UUID, dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({where: {plate: dto.plate}})
    if (vehicle) {
      const isOwner = vehicle.owners.some((it) => it.id === driverId)
      if (isOwner) {
        throw new ConflictException('Veículo já encontra-se cadastrado')
      }
      throw new ConflictException('Veículo pertence a outro motorista')
    }
    const newVehicle = new Vehicle()
    newVehicle.model = dto.model
    newVehicle.plate = dto.plate
    newVehicle.kilometers = dto.kilometers
    newVehicle.year = dto.year
    const owner = await this.driverService.findById(driverId)
    newVehicle.owners = [owner]
    return await this.vehicleRepository.save(newVehicle)
  }

  async getVehicles(driverId: UUID): Promise<Vehicle[]> {
    await this.driverService.findById(driverId)
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
      throw new NotFoundException('Veículo não encontrado')
    }
    return vehicle
  }

  async shareVehicle(vehicleId: UUID, driverId: UUID, shareVehicleDto: ShareVehicleDto): Promise<Vehicle>{
    const vehicle = await this.vehicleRepository.findOne({where: {id: vehicleId}})
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const isOwner = vehicle.owners.some((it) => it.id === driverId)
    if(!isOwner){
      throw new NotFoundException('Motorista não encontrado');
    }

    const newOwner = await this.driverService.findByUserName(shareVehicleDto.cpf)

    const alreadyAssociated = vehicle.owners.some(owner => owner.user.username === shareVehicleDto.cpf);
    if (alreadyAssociated) {
      throw new ConflictException('Motorista já está associado ao veículo');
    }
    
    vehicle.owners.push(newOwner)
    return await this.vehicleRepository.save(vehicle)
  }

  async updateKilometers(driverId: UUID, updateKilometers: UpdateKilometersDto): Promise<Vehicle> {
    
    const vehicleId = updateKilometers.vehicleId
    const kilometers = updateKilometers.kilometers

    const vehicle = await this.vehicleRepository.findOne({where: {id: vehicleId}})
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const isOwner = vehicle.owners.some((it) => it.id === driverId)
    if(!isOwner){
      throw new NotFoundException('Veículo informado não pertence ao motorista');
    }

    if (kilometers < vehicle.kilometers) {
      throw new BadRequestException('A quilometragem atual não pode ser menor do que a quilometragem anterior');
    }

    vehicle.kilometers = kilometers;
    return await this.vehicleRepository.save(vehicle);
  }
}

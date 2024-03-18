import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UUID} from 'crypto'
import {DriverService} from '../driver/driver.service'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {DataSource, Repository} from 'typeorm'
import {Vehicle} from './entities/vehicle.entity'
import {UserService} from 'src/user/user.service'
import {ShareVehicleDto} from 'src/shared/vehicle/dto/request/share-vehicle.dto'
import {Driver} from 'src/driver/entities/driver.entity'
import {UserTypeService} from 'src/user/user.type.service'
import {UserTypeEnum} from 'src/shared/user/enums/user-type.enum'

@Injectable()
export class VehicleService {
  constructor(
    private readonly driverService: DriverService,
    private readonly userService: UserService,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly dataSource: DataSource,
    private readonly userTypeService: UserTypeService
  ) {}

  async create(userId: UUID, dto: CreateVehicleDto): Promise<Vehicle> {
    const user = await this.userService.findById(userId)
    if (user.userType.name !== UserTypeEnum.DRIVER) {
      throw new ForbiddenException('Você não pode associar esse usuário')
    }
    const vehicle = await this.vehicleRepository.findOne({
      where: {plate: dto.plate},
      relations: {drivers: true}
    })
    if (vehicle) {
      const isOwner = vehicle.drivers.some((it) => it.user.id === userId && it.isOwner)
      if (isOwner) {
        throw new ConflictException('Veículo já encontra-se cadastrado')
      }
      throw new ConflictException('Veículo pertence a outro motorista')
    }

    const driver = new Driver()
    driver.isOwner = true
    driver.user = user

    const newVehicle = new Vehicle()
    newVehicle.model = dto.model
    newVehicle.plate = dto.plate
    newVehicle.kilometers = dto.kilometers
    newVehicle.year = dto.year

    newVehicle.drivers = [driver]
    const createdVehicle = await this.dataSource.manager.save(Vehicle, newVehicle)
    driver.vehicle = createdVehicle
    await this.dataSource.manager.save(Driver, driver)

    return createdVehicle
  }

  async getVehicles(userId: UUID): Promise<Vehicle[]> {
    let user
    try {
      user = await this.userService.findById(userId)
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        (user && user.userType.name !== UserTypeEnum.DRIVER)
      ) {
        throw new NotFoundException('Motorista não encontrado')
      }
      throw new InternalServerErrorException()
    }
    return await this.vehicleRepository.find({where: {drivers: {user: user}}})
  }

  async findById(id: UUID): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {id: id},
      relations: {components: true, drivers: true}
    })
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado')
    }
    return vehicle
  }

  async shareVehicle(
    vehicleId: UUID,
    userId: UUID,
    shareVehicleDto: ShareVehicleDto
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {id: vehicleId},
      relations: {drivers: true}
    })
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado')
    }

    const isOwner = vehicle.drivers.some((it) => it.user.id === userId && it.isOwner)
    if (!isOwner) {
      throw new NotFoundException('Motorista não encontrado')
    }

    const alreadyAssociated = vehicle.drivers.some(
      (owner) => owner.user.username === shareVehicleDto.cpf
    )
    if (alreadyAssociated) {
      throw new ConflictException('Motorista já está associado ao veículo')
    }

    const user = await this.userService.findByUsername(shareVehicleDto.cpf)
    if (user.userType.name !== UserTypeEnum.DRIVER) {
      throw new ForbiddenException('Você não pode associar esse usuário')
    }

    const driver = new Driver()
    driver.user = user
    user.userType = await this.userTypeService.findByName(UserTypeEnum.DRIVER)

    vehicle.drivers.push(driver)
    const updatedVeicule = await this.dataSource.manager.save(Vehicle, vehicle)
    driver.vehicle = updatedVeicule
    await this.dataSource.manager.save(Driver, driver)

    return updatedVeicule
  }
}

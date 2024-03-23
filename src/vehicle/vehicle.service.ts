import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {DriverService} from '../driver/driver.service'
import {CreateVehicleDto} from '../shared/vehicle/dto/request/create-vehicle.dto'
import {DataSource, Repository} from 'typeorm'
import {Vehicle} from './entities/vehicle.entity'
import {UserService} from '../user/user.service'
import {ShareVehicleDto} from '../shared/vehicle/dto/request/share-vehicle.dto'
import {Driver} from '../driver/entities/driver.entity'
import {UserTypeService} from '../user/user.type.service'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {UpdateKilometersDto} from '../shared/vehicle/dto/request/update-kilometers.dto'

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

  async create(userId: number, dto: CreateVehicleDto): Promise<Vehicle> {
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

  async getVehicles(userId: number): Promise<Vehicle[]> {
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
    return await this.vehicleRepository.find({where: {drivers: {user: {id: user.id}}}})
  }

  async findById(id: number): Promise<Vehicle> {
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
    vehicleId: number,
    userId: number,
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
      throw new UnauthorizedException('Veículo informado não pertence ao motorista')
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

  async updateKilometers(
    userId: number,
    vehicleId: number,
    updateKilometers: UpdateKilometersDto
  ): Promise<Vehicle> {
    const kilometers = updateKilometers.kilometers

    const vehicle = await this.vehicleRepository.findOne({
      where: {id: vehicleId},
      relations: {drivers: true}
    })
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado')
    }

    const canUseVehicle = vehicle.drivers.some((it) => it.user.id === userId)
    if (!canUseVehicle) {
      throw new UnauthorizedException('Veículo informado não pertence ao motorista')
    }

    if (kilometers < vehicle.kilometers) {
      throw new BadRequestException(
        'A quilometragem atual não pode ser menor do que a quilometragem anterior'
      )
    }

    vehicle.kilometers = kilometers
    return await this.vehicleRepository.save(vehicle)
  }
}

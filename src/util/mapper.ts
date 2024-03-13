import { Driver } from "src/driver/entities/driver.entity";
import { DriverResponseDTO } from "src/shared/driver/dto/response/driver.response.dto";
import { VehicleResponseDTO } from "src/shared/vehicle/dto/response/vahicle.response.dto";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";

export const createDriverResponseDTO = (driver: Driver): DriverResponseDTO => {
    const dto = new DriverResponseDTO()
    dto.uuid = driver.uuid
    dto.email = driver.user.email
    dto.birthday = driver.user.birthday
    dto.name = driver.user.name
    dto.username = driver.user.username
    return dto
}

export const createVehicleResponseDTO = (vehicle: Vehicle): VehicleResponseDTO => {
    const dto = new VehicleResponseDTO
    dto.uuid = vehicle.uuid
    dto.model = vehicle.model
    dto.plate = vehicle.plate
    dto.year = vehicle.year
    dto.kilometers = vehicle.kilometers
    return dto
}
import { Driver } from "src/driver/entities/driver.entity";
import { Establishment } from "src/establishment/entities/establishment.entity";
import { LoginPayload } from "src/shared/auth/dto/login.payload.dto";
import { DriverResponseDTO } from "src/shared/driver/dto/response/driver.response.dto";
import { EstablishmentResponseDTO } from "src/shared/establishment/dto/response/establishment.response.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { VehicleResponseDTO } from "src/shared/vehicle/dto/response/vahicle.response.dto";
import { User } from "src/user/entities/user.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";

export const createDriverResponseDTO = (driver: Driver): DriverResponseDTO => {
    const dto = new DriverResponseDTO()
    dto.id = driver.id
    dto.email = driver.user.email
    dto.birthday = driver.user.birthday
    dto.name = driver.user.name
    dto.username = driver.user.username
    return dto
}

export const createVehicleResponseDTO = (vehicle: Vehicle): VehicleResponseDTO => {
    const dto = new VehicleResponseDTO
    dto.id = vehicle.id
    dto.model = vehicle.model
    dto.plate = vehicle.plate
    dto.year = vehicle.year
    dto.kilometers = vehicle.kilometers
    return dto
}

export const createEstablishmentResponseDTO = (establishment: Establishment): EstablishmentResponseDTO => {
    const dto = new EstablishmentResponseDTO()
    dto.id = establishment.id
    dto.email = establishment.user.email
    dto.birthday = establishment.user.birthday
    dto.name = establishment.user.name
    dto.username = establishment.user.username
    return dto
}

export const createLoginPayload = (user: User): LoginPayload => {
    const payload = new LoginPayload()
    payload.id = user.id
    payload.userType = (UserTypeEnum as any)[user.userType.name]
    return payload
}
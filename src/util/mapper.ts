import { Component } from "src/components/entities/component.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { Establishment } from "src/establishment/entities/establishment.entity";
import { ComponentsResponseDTO } from "src/shared/components/dto/response/components.response.dto";
import { DriverResponseDTO } from "src/shared/driver/dto/response/driver.response.dto";
import { EstablishmentResponseDTO } from "src/shared/establishment/dto/response/establishment.response.dto";
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
    dto.id = vehicle.id
    dto.model = vehicle.model
    dto.plate = vehicle.plate
    dto.year = vehicle.year
    dto.kilometers = vehicle.kilometers
    return dto
}

export const createEstablishmentResponseDTO = (establishment: Establishment): EstablishmentResponseDTO => {
    const dto = new EstablishmentResponseDTO()
    dto.uuid = establishment.uuid
    dto.email = establishment.user.email
    dto.birthday = establishment.user.birthday
    dto.name = establishment.user.name
    dto.username = establishment.user.username
    return dto
}
export const createComponentResponseDTO = (component: Component): ComponentsResponseDTO => {
    const dto = new ComponentsResponseDTO
    dto.id = component.id
    dto.componentType = component.componentType.name
    dto.dateLastExchange = component.dateLastExchange
    dto.maintenanceFrequency = component.maintenanceFrequency
    dto.kilometersLastExnchange = component.kilometersLastExnchange
    dto.vehicleId = component.vehicle.id
    return dto
}
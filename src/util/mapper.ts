import {UserResponseDTO} from 'src/shared/user/dto/response/user.response.dto'
import {Component} from '../component/entities/component.entity'
import {Driver} from '../driver/entities/driver.entity'
import {Establishment} from '../establishment/entities/establishment.entity'
import {LoginPayload} from '../shared/auth/dto/login.payload.dto'
import {ComponentResponseDTO} from '../shared/component/dto/response/component.response.dto'
import {DriverResponseDTO} from '../shared/driver/dto/response/driver.response.dto'
import {EstablishmentResponseDTO} from '../shared/establishment/dto/response/establishment.response.dto'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {VehicleResponseDTO} from '../shared/vehicle/dto/response/vahicle.response.dto'
import {User} from '../user/entities/user.entity'
import {Vehicle} from '../vehicle/entities/vehicle.entity'

export const createUserResponseDTO = (user: User): UserResponseDTO => {
  const dto = new UserResponseDTO()
  dto.id = user.id
  dto.username = user.username
  dto.email = user.email
  dto.name = user.name
  return dto
}

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
  const dto = new VehicleResponseDTO()
  dto.id = vehicle.id
  dto.model = vehicle.model
  dto.plate = vehicle.plate
  dto.year = vehicle.year
  dto.kilometers = vehicle.kilometers
  return dto
}

export const createEstablishmentResponseDTO = (
  establishment: Establishment
): EstablishmentResponseDTO => {
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
  payload.resetPassword = user.resetPassword
  return payload
}

export const createComponentResponseDTO = (component: Component): ComponentResponseDTO => {
  const dto = new ComponentResponseDTO()
  dto.id = component.id
  dto.componentType = component.componentType.name
  dto.dateLastExchange = component.dateLastExchange
  dto.maintenanceFrequency = component.maintenanceFrequency
  dto.kilometersLastExnchange = component.kilometersLastExchange
  dto.vehicleId = component.vehicle.id
  return dto

}

import { Avaliation } from 'src/avaliation/entities/avaliation.entity'
import { Call } from 'src/call/entites/call.entity'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { Schedule } from 'src/schedule/entities/schedule.entity'
import { GetAvaliation } from 'src/shared/avaliation/dto/response/get_avaliations.dto'
import { CallResponseDTO } from 'src/shared/call/dto/response/call.response.dto'
import { FuelResponseDTO } from 'src/shared/fuel/dto/response/fuel.response.dto'
import { ScheduleResponseDTO } from 'src/shared/schedule/response/schedule-response.dto'
import { Component } from '../component/entities/component.entity'
import { Driver } from '../driver/entities/driver.entity'
import { Establishment } from '../establishment/entities/establishment.entity'
import { LoginPayload } from '../shared/auth/dto/login.payload.dto'
import { ComponentResponseDTO } from '../shared/component/dto/response/component.response.dto'
import { DriverResponseDTO } from '../shared/driver/dto/response/driver.response.dto'
import { EstablishmentResponseDTO } from '../shared/establishment/dto/response/establishment.response.dto'
import { UserResponseDTO } from '../shared/user/dto/response/user.response.dto'
import { UserTypeEnum } from '../shared/user/enums/user-type.enum'
import { VehicleResponseDTO } from '../shared/vehicle/dto/response/vahicle.response.dto'
import { User } from '../user/entities/user.entity'
import { Vehicle } from '../vehicle/entities/vehicle.entity'

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

export const createScheduleDTO= (schedule: Schedule): ScheduleResponseDTO => {
  const dto = new ScheduleResponseDTO()
  dto.id = schedule.id
  dto.shifts = schedule.shifts
  dto.establishment = schedule.establishment
  return dto
}
export const createAvaliationResponseDTO= (avaliation: Avaliation): GetAvaliation => {
  const dto = new GetAvaliation()
  dto.id = avaliation.id
  dto.comment = avaliation.comment
  dto.establishment = avaliation.establishment
  dto.grade = avaliation.grade
  dto.date = avaliation.date
  dto.user = avaliation.user
  return dto
}

export const createCallResponseDTO= (call: Call): CallResponseDTO=> {
  const dto = new CallResponseDTO()
  dto.id = call.id
  dto.coment = call.comment
  dto.latitude = call.latitude
  dto.longitude = call.longitude
  dto.user = call.user
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

export const createLoginPayload = (user: User, vehicleId?: number): LoginPayload => {
  const payload = new LoginPayload()
  payload.id = user.id
  payload.userType = UserTypeEnum[user.userType.name]
  payload.resetPassword = user.resetPassword
  payload.vehicleId = vehicleId
  return payload
}

export const createComponentResponseDTO = (component: Component): ComponentResponseDTO => {
  const dto = new ComponentResponseDTO()
  dto.id = component.id
  dto.componentType = component.componentType.name
  dto.dateLastExchange = component.dateLastExchange
  dto.maintenanceFrequency = component.maintenanceFrequency
  dto.kilometersLastExnchange = component.kilometersLastExchange
  return dto
}
export const createFuelResponseDTO = (fuel: Fuel): FuelResponseDTO => {
  const dto = new FuelResponseDTO()
  dto.id = fuel.id
  dto.fuelType = fuel.fuelType.name
  dto.fuelTitle = fuel.fuelTitle
  dto.value = fuel.value
  dto.productStatus= fuel.productStatus
  return dto
}

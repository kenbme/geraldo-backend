import {UUID} from 'crypto'
import {Driver} from 'src/driver/entities/driver.entity'

export class DriverResponseDTO {
  uuid: UUID
  username: string
  name: string
  email: string
  birthday: Date

  constructor(driver: Driver) {
    this.uuid = driver.uuid
    this.email = driver.user.email
    this.birthday = driver.user.birthday
    this.name = driver.user.name
    this.username = driver.user.username
  }
}

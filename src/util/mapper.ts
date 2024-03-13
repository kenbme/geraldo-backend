import { Driver } from "src/driver/entities/driver.entity";
import { DriverResponseDTO } from "src/shared/driver/dto/response/driver.response.dto";

export const createDriverResponseDTO = (driver: Driver): DriverResponseDTO => {
    const dto = new DriverResponseDTO()
    dto.uuid = driver.uuid
    dto.email = driver.user.email
    dto.birthday = driver.user.birthday
    dto.name = driver.user.name
    dto.username = driver.user.username
    return dto
}

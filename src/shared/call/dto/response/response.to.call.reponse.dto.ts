import { Establishment } from "src/establishment/entities/establishment.entity"
import { User } from "src/user/entities/user.entity"

export class ResposeToCallResponseDTO {
    id: number
    coment: string
    latitude:number
    longitude:number
    user:User
    establishmentAccepted: Establishment
  }
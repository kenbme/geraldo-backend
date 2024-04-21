import { User } from "src/user/entities/user.entity"

export class CallResponseDTO {
    id: number
    coment: string
    latitude:number
    longitude:number
    user:User
  }
  
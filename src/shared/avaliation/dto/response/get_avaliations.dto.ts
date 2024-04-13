import { Establishment } from "src/establishment/entities/establishment.entity"
import { User } from "src/user/entities/user.entity"

export class GetAvaliation{
    id: number
    comment:string
    grade:number
    establishment: Establishment
    user: User
    date: Date
}
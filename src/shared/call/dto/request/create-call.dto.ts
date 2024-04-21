import { IsDecimal, IsNotEmpty, IsString } from "class-validator"

export class CreateCallDTO{
    @IsDecimal()
    longitude: number
    @IsDecimal()
    latitude: number
    @IsString()
    @IsNotEmpty()
    comment: string

}
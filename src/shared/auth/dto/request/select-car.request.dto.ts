import { IsInt, IsNotEmpty } from "class-validator";

export class SelectCarDTO {
    @IsNotEmpty()
    @IsInt()
    vehicleId: number
}
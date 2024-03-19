import {IsInt, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsInt()
  @Min(0)
  kilometers: number
}

import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator'
import { UUID } from 'crypto'
import { isValidYear } from '../../validators/isValidYear'

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({message: 'O modelo não pode ser vazio'})
  model: string

  @IsString()
  @IsNotEmpty({message: 'A placa não pode ser vazio'})
  plate: string

  @IsInt()
  @IsNotEmpty({message: 'A quilometragem não pode ser vazio'})
  @Min(0)
  kilometers: number

  @IsInt({message: "O ano precisa ser um inteiro"})
  @IsNotEmpty({message: 'Ano não pode ser vazio'})
  @isValidYear({message: 'Ano inválido'})
  year: number

  @IsUUID()
  driverId: UUID
}

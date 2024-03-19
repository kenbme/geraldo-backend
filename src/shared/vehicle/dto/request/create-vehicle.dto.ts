import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
import { isValidYear } from '../../validators/isValidYear'

export class CreateVehicleDto {
  @IsString({message: 'O modelo precisa ser uma string'})
  @IsNotEmpty({message: 'O modelo não pode ser vazio'})
  model: string

  @IsString({message: 'A plca precisa ser uma string'})
  @IsNotEmpty({message: 'A placa não pode ser vazio'})
  plate: string

  @IsInt({message: 'A quilometragem precisa ser um inteiro'})
  @IsNotEmpty({message: 'A quilometragem não pode ser vazio'})
  @Min(0,{message: 'A quilometragem tem que ser maior ou igual a 0'})
  kilometers: number

  @IsInt({message: 'O ano precisa ser um inteiro'})
  @IsNotEmpty({message: 'Ano não pode ser vazio'})
  @isValidYear({message: 'Ano inválido'})
  year: number
}

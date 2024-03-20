import {IsInt, IsNotEmpty, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsNotEmpty({message: 'A quilometragem não pode ser vazio'})
  @IsInt({message: 'A quilometragem precisa ser um inteiro'})
  @Min(0, {message: 'A quilometragem tem que ser maior ou igual a 0'})
  kilometers: number
}

import {IsInt, IsNotEmpty, Min} from 'class-validator'

export class UpdateKilometersDto {
  @IsInt({message: 'A quilometragem precisa ser um inteiro'})
  @IsNotEmpty({message: 'A quilometragem não pode ser vazio'})
  @Min(0,{message: 'A quilometragem tem que ser maior ou igual a 0'})
  kilometers: number
}

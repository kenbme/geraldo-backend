import {IsNotEmpty, IsNumber, Min, Max} from 'class-validator'

export class GetEstablishmentsQuery{
  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
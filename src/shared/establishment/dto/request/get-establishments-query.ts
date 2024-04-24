import {IsNotEmpty, IsDecimal} from 'class-validator'

export class GetEstablishmentsQuery{
  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsDecimal()
  latitude: number;

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsDecimal()
  longitude: number;
}
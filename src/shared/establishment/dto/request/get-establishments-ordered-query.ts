import {IsNotEmpty, IsEnum, IsDecimal} from 'class-validator'
import { FuelTypeEnum } from '../../../../shared/fuel/enum/fuel.type.enum';

export class GetEstablishmentsOrderedByPriceQuery{
  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsEnum(FuelTypeEnum)
  fuelType: FuelTypeEnum

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsDecimal()
  latitude: number;

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsDecimal()
  longitude: number;
}
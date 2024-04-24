import {IsNotEmpty, IsNumber, Min, Max, IsEnum} from 'class-validator'
import { FuelTypeEnum } from '../../../../shared/fuel/enum/fuel.type.enum';

export class GetEstablishmentsOrderedByPriceQuery{
  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsEnum(FuelTypeEnum)
  fuelType: FuelTypeEnum

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
import {IsString, IsEnum, IsNotEmpty, IsNumber, IsBoolean, isNumber, IsInt, Min} from 'class-validator'
import { FuelTypeEnum } from '../../enum/fuel.type.enum'

export class UpdateFuelDTO {
  
  @IsNotEmpty({message: 'tipo de combustivel não pode ser vazio'})
  @IsEnum(FuelTypeEnum,{message: 'Tipo de combustível não encontrado'})
  fuelType: FuelTypeEnum
  @IsNotEmpty({message: 'O titulo do combustivel não pode ser vazio'})
  @IsString({message: 'O titulo deve ser uma string'})
  fuelTitle: string
  
  @IsNotEmpty({message: 'O valor não pode ser vazio'})
  @IsNumber({},{message: 'O valor deve ser um numero'})
  @Min(0,{message: 'O valor deve ser um numero positivo'})
  value: number
  
  @IsNotEmpty({message: 'tipo de combustivel não pode ser vazio'})
  @IsBoolean({message: 'O status do produto deve ser um boolean'})
  productStatus: boolean
}

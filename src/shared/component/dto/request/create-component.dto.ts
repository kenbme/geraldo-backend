import {IsEnum, IsInt, IsNotEmpty} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsNotEmpty()
  @IsEnum(ComponentTypeEnum,{message: 'Componente veicular não encontrado'})
  componentType: ComponentTypeEnum

  @IsNotEmpty()
  @IsDateValid()
  dateLastExchange: string
  
  @IsNotEmpty()
  @IsInt({message: 'A quilometragem da ultima troca deve ser um inteiro'})
  kilometersLastExchange: number
  
  @IsNotEmpty()
  @IsInt({message: 'A frequencia de manuntenção deve ser um inteiro'})
  maintenanceFrequency: number

}

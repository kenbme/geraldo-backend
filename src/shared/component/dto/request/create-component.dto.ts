import {IsEnum, IsInt} from 'class-validator'
import {IsDateValid} from '../../validators/IsDateValid'
import {ComponentTypeEnum} from '../../enums/component-type.enum'

export class CreateComponentDto {
  @IsEnum(ComponentTypeEnum,{message: 'Componente veicular não encontrado'})
  componentType: ComponentTypeEnum

  @IsDateValid()
  dateLastExchange: string

  @IsInt({message: 'A quilometragem da ultima troca deve ser um inteiro'})
  kilometersLastExchange: number

  @IsInt({message: 'A frequencia de manuntenção deve ser um inteiro'})
  maintenanceFrequency: number

  @IsInt()
  vehicleId: number
}

import {IsNotEmpty} from 'class-validator'
import {IsCPF} from '../../../../shared/user/validators/IsCPF'

export class ShareVehicleDto {
  @IsNotEmpty()
  @IsCPF()
  cpf: string
}

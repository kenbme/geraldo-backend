import {UUID} from 'crypto'
import {UserTypeEnum} from '../../../shared/user/enums/user-type.enum'

export class LoginPayload {
  id: UUID
  userType: UserTypeEnum
  resetPassword: boolean
}

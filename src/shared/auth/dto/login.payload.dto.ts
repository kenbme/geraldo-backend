import {UserTypeEnum} from '../../../shared/user/enums/user-type.enum'

export class LoginPayload {
  id: number
  userType: UserTypeEnum
  resetPassword: boolean
}

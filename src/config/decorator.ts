import {CustomDecorator, SetMetadata} from '@nestjs/common'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = (): CustomDecorator<string> => SetMetadata(IS_PUBLIC_KEY, true)

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserTypeEnum[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles)

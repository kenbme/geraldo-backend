import {SetMetadata} from '@nestjs/common'
import { UserTypeEnum } from 'src/shared/user/enums/user-type.enum'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserTypeEnum[]) => SetMetadata(ROLES_KEY, roles);

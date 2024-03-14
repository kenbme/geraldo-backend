import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserTypeEnum } from './shared/user/enums/user-type.enum'
import { ROLES_KEY } from './decorator'
import { JwtService } from '@nestjs/jwt'
import { LoginPayload } from './shared/auth/dto/login.payload.dto'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserTypeEnum[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
      if (!requiredRoles) {
        return true
      }
    const { authorization } = context.switchToHttp().getRequest().headers
    const loginPayload: LoginPayload | undefined = await this.jwtService
      .verifyAsync(authorization.split(" ")[1], {
        secret: process.env.JWT_SECRET_KEY,
      })
      .catch(() => undefined)
    if(!loginPayload){
        return false
    }  
    return requiredRoles.some((role) => role === loginPayload.userType)
  }
}
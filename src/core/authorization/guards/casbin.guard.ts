import { LoggerService } from '../../logger/logger.service'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'

@Injectable()
export class CasbinGuard implements CanActivate {
  protected logger = LoggerService.getInstance(CasbinGuard.name)

  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest()
    const resource = Object.keys(query).length ? route.path : originalUrl

    if (!user) {
      this.logger.warn(
        `${action} ${resource} -> ${false} - Usuario desconocido`
      )
      throw new UnauthorizedException()
    }

    for (const rol of user.roles) {
      const isPermitted = await this.enforcer.enforce(rol, resource, action)
      if (isPermitted) {
        this.logger.info(`${action} ${resource} -> ${isPermitted} - ${rol}`)
        return true
      }
    }

    this.logger.warn(
      `${action} ${resource} -> ${false} - ${user.roles.toString()}`
    )
    throw new ForbiddenException()
  }
}

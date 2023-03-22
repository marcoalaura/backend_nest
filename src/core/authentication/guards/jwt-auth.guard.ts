import { LoggerService } from '../../logger/logger.service'
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  protected logger = LoggerService.getInstance(JwtAuthGuard.name)

  async canActivate(context: ExecutionContext) {
    const {
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest()
    const resource = Object.keys(query).length ? route.path : originalUrl

    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      if (!isPermitted) throw new ForbiddenException()
    } catch (err) {
      const errMsg = `${action} ${resource} -> false (Error con el token)`
      this.logger.warn(errMsg)
      throw err
    }

    // this.logger.info(`${action} ${resource} -> true`)
    return true
  }
}

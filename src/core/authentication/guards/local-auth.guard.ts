import { LoggerService } from '../../logger/logger.service'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  protected logger = LoggerService.getInstance(LocalAuthGuard.name)

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
      if (!isPermitted) throw new UnauthorizedException()
    } catch (err) {
      const errMsg = `${action} ${resource} -> ${false} (Error con usuario y contraseña)`
      this.logger.warn(errMsg)
      throw err
    }

    this.logger.info(`${action} ${resource} -> true`)
    return true
  }
}

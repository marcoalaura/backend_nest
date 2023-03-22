import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AuthZManagementService } from 'nest-authz'

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly rbacSrv: AuthZManagementService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl: resource, method: action } = req
    // obtener rol del token
    const rol = 'ADMINISTRADOR'
    const app = 'backend'
    const isValid = await this.rbacSrv.hasPolicy(rol, resource, action, app)
    if (!isValid) {
      return res.status(403).json({
        mensaje: 'No authorizado',
      })
    }
    next()
  }
}

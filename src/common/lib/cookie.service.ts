import { CookieOptions } from 'express-serve-static-core'
import { ConfigService } from '@nestjs/config'

export class CookieService {
  static makeConfig(configService: ConfigService): CookieOptions {
    const expiresIn = configService.get('REFRESH_TOKEN_EXPIRES_IN')
    const ttl = parseInt(expiresIn, 10)
    return {
      httpOnly: true,
      secure: configService.get('REFRESH_TOKEN_SECURE') === 'true',
      expires: new Date(Date.now() + ttl),
      path: configService.get('REFRESH_TOKEN_PATH'),
    }
  }
}

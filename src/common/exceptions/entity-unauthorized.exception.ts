import { HttpException, HttpStatus } from '@nestjs/common'
import { Messages } from '../constants/response-messages'

export class EntityUnauthorizedException extends HttpException {
  constructor(message = Messages.EXCEPTION_UNAUTHORIZED) {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}

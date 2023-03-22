import { HttpException, HttpStatus } from '@nestjs/common'
import { Messages } from '../constants/response-messages'

export class EntityForbiddenException extends HttpException {
  constructor(message = Messages.EXCEPTION_FORBIDDEN) {
    super(message, HttpStatus.FORBIDDEN)
  }
}

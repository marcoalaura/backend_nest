import { HttpException, HttpStatus } from '@nestjs/common'
import { Messages } from '../constants/response-messages'

export class EntityNotFoundException extends HttpException {
  constructor(message = Messages.EXCEPTION_NOT_FOUND) {
    super(message, HttpStatus.NOT_FOUND)
  }
}

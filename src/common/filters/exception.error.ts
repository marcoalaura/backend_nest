import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'
import { Messages } from '../constants/response-messages'
import { AxiosError } from 'axios'

export class ExceptionError extends Error {
  codigo: number
  mensaje: string
  errores: (string | object)[]
  stack: string | undefined

  constructor(original: unknown) {
    super()

    if (original instanceof HttpException) {
      this.codigo = ExceptionError.getCodigo(original)
      this.mensaje = ExceptionError.getMensaje(original)
      this.errores = ExceptionError.getErrores(original)
      this.stack = original.stack
      return
    }

    if (original instanceof AxiosError) {
      this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
      this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
      this.errores = [{ axiosError: original }]
      this.stack = original.stack
      return
    }

    if (original instanceof Error) {
      this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
      this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
      this.errores = [original.toString()]
      this.stack = original.stack
      return
    }

    this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
    this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
    this.errores = [String(original)]
  }

  private static getCodigo(exception: HttpException): number {
    return exception.getStatus()
  }

  private static getMensaje(exception: HttpException): string {
    const response = exception.getResponse() as ObjectOrError | string
    if (typeof response === 'string') {
      return ExceptionError.traducirMensaje(response)
    }

    if (response.message && response.error) {
      if (typeof response.message === 'string') {
        return ExceptionError.traducirMensaje(response.message)
      }

      const unicoMensajeTipoString =
        Array.isArray(response.message) &&
        response.message.length === 1 &&
        typeof response.message[0] === 'string'

      if (unicoMensajeTipoString) {
        return ExceptionError.traducirMensaje(response.message[0])
      }
    }

    switch (exception.constructor) {
      case BadRequestException:
        return Messages.EXCEPTION_BAD_REQUEST
      case UnauthorizedException:
        return Messages.EXCEPTION_UNAUTHORIZED
      case NotFoundException:
        return Messages.EXCEPTION_NOT_FOUND
      case PreconditionFailedException:
        return Messages.EXCEPTION_PRECONDITION_FAILED
      case ForbiddenException:
        return Messages.EXCEPTION_FORBIDDEN
      default:
        return Messages.EXCEPTION_INTERNAL_SERVER_ERROR
    }
  }

  private static traducirMensaje(mensaje: string) {
    if (mensaje === 'Forbidden resource') {
      return Messages.EXCEPTION_FORBIDDEN
    }
    return mensaje
  }

  private static getErrores(exception: HttpException): (string | object)[] {
    const response = exception.getResponse() as ObjectOrError | string

    if (typeof response === 'string') {
      return []
    }

    if (!response.statusCode) {
      return [response]
    }

    if (!response.message) {
      return [response]
    }

    if (!Array.isArray(response.message)) {
      return []
    }

    const unicoMensajeTipoString =
      response.message.length === 1 && typeof response.message[0] === 'string'

    if (unicoMensajeTipoString) {
      return []
    }

    return response.message
  }
}

export type ObjectOrError = {
  statusCode?: number
  message?: string | object | (string | object)[]
  error?: string
}

import { HttpException, HttpStatus } from '@nestjs/common'

export class ExternalServiceException extends HttpException {
  constructor(service: string, err: unknown) {
    super(
      {
        message: `Error con el Servicio Web ${service}`,
        error: err,
        errorStack: err instanceof Error ? err.stack : undefined,
      },
      HttpStatus.PRECONDITION_FAILED
    )
  }
}

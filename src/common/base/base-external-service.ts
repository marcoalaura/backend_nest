import { LoggerConfig } from '../../core/logger/logger.config'
import { HttpService } from '@nestjs/axios'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { firstValueFrom } from 'rxjs'
import { BaseService } from './base-service'

export class BaseExternalService extends BaseService {
  constructor(
    protected context: string,
    protected http: HttpService,
    protected serviceName: string
  ) {
    super(context)
  }

  protected async request(
    requestConfig: AxiosRequestConfig,
    enableSuccessLogging = true
  ): Promise<{ status: number; body?: unknown }> {
    try {
      const response = await firstValueFrom(this.http.request(requestConfig))
      const responseStatus = response.status
      const responseBody = response.data
      if (enableSuccessLogging) {
        this.logger.info({
          requestConfig,
          responseStatus,
          responseBody,
        })
      }
      return { status: responseStatus, body: responseBody }
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        this.logger.error({ requestConfig, requestError: error })
        return { status: 500 }
      }

      if (!error.response) {
        this.logger.error({ requestConfig, requestError: error })
        return { status: 500 }
      }

      const responseStatus = error.response.status
      const responseBody = error.response.data

      const logLevel = LoggerConfig.getLogLevel(responseStatus, error)
      this.logger[logLevel]({
        requestConfig,
        responseStatus,
        responseBody,
      })

      return { status: responseStatus, body: responseBody }
    }
  }
}

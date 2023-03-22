import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { LoggerConfig } from './logger.config'
import { LoggerService } from './logger.service'

@Module({
  exports: [LoggerService],
  providers: [LoggerService],
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: [LoggerConfig.getPinoHttpConfig(), LoggerConfig.getStream()],
    }),
  ],
})
export class LoggerModule {}

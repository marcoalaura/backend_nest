import { LoggerModule } from 'nestjs-pino'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerConfig } from './logger.config'
import { LoggerService } from './logger.service'

describe('LoggerService', () => {
  let service: LoggerService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
      imports: [
        LoggerModule.forRoot({
          pinoHttp: [
            LoggerConfig.getPinoHttpConfig(),
            LoggerConfig.getStream(),
          ],
        }),
      ],
    }).compile()
    service = await module.resolve<LoggerService>(LoggerService)
  })

  it('Debería ser implementado como ', () => {
    expect(service).toBeDefined()
  })
  it('streams', () => {
    expect(Array.isArray(LoggerConfig.getStream().streams)).toEqual(true)
  })
  it('Configuracion', () => {
    expect(LoggerConfig.getLoggerConfig().pinoHttp).toHaveProperty('name')
    expect(LoggerConfig.getLoggerConfig().pinoHttp).toHaveProperty('genReqId')
    expect(LoggerConfig.getLoggerConfig().pinoHttp).toHaveProperty(
      'serializers'
    )
    expect(LoggerConfig.getLoggerConfig().pinoHttp).toHaveProperty('level')
    expect(LoggerConfig.getLoggerConfig().pinoHttp).toHaveProperty('timestamp')
  })
})

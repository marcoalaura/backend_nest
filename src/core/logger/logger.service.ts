import { Injectable, Scope } from '@nestjs/common'
import dayjs from 'dayjs'
import { Logger, PinoLogger } from 'nestjs-pino'
import { inspect } from 'util'
import { COLOR, LOG_COLOR, LOG_LEVEL } from './constants'
import fastRedact from 'fast-redact'
import { LoggerConfig } from './logger.config'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private context: string = LoggerService.name
  private readonly redact: fastRedact.redactFn

  constructor(pinoLogger: PinoLogger) {
    super(pinoLogger, {})
    this.redact = fastRedact(LoggerConfig.redactOptions())
  }

  setContext(context: string) {
    if (!LoggerService.instances[context]) {
      LoggerService.instances[context] = this
      delete LoggerService.instances[this.context]
    }

    this.logger.setContext(context)
    this.context = context
  }

  getContext(): string {
    return this.context
  }

  /**
   * @deprecated Cambiado por el método info. Ej: this.loggger.info('message')
   * @param optionalParams
   */
  log(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  /**
   * @deprecated Cambiado por el método trace. Ej: this.loggger.trace('message')
   * @param optionalParams
   */
  verbose(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.TRACE, ...optionalParams)
  }

  error(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.ERROR, ...optionalParams)
  }

  warn(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.WARN, ...optionalParams)
  }

  info(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  debug(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.DEBUG, ...optionalParams)
  }

  trace(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.TRACE, ...optionalParams)
  }

  private print(level: LOG_LEVEL, ...optionalParams: unknown[]) {
    try {
      if (LoggerConfig.logLevelSelected.includes(level)) {
        optionalParams.map((param) => this.logger[level](param))
      }
      if (process.env.NODE_ENV === 'production') return

      const color = this.getColor(level)
      const time = dayjs().format('DD/MM/YYYY HH:mm:ss')
      const cTime = `${COLOR.RESET}[${time}]${COLOR.RESET}`
      const cLevel = `${color}${level.toUpperCase()}${COLOR.RESET}`
      const cContext = `${COLOR.RESET}(${this.context}):${COLOR.RESET}`
      process.stdout.write(`${cTime} ${cLevel} ${cContext} ${color}`)
      optionalParams.map((data) => {
        try {
          data =
            data && typeof data === 'object' && !(data instanceof Error)
              ? JSON.parse(this.redact(JSON.parse(JSON.stringify(data))))
              : data
        } catch (err) {}
        const toPrint =
          typeof data === 'object'
            ? inspect(data, false, null, false)
            : String(data)
        console.log(`${color}${toPrint.replace(/\n/g, `\n${color}`)}`)
      })
      process.stdout.write(COLOR.RESET)
    } catch (e) {
      console.error(e)
    }
  }

  private getColor(level: LOG_LEVEL) {
    return LOG_COLOR[level]
  }

  static instances: { [key: string]: LoggerService } = {}

  static getInstance(context: string) {
    if (LoggerService.instances[context]) {
      return LoggerService.instances[context]
    }
    const pinoLogger = new PinoLogger({
      pinoHttp: [LoggerConfig.getPinoHttpConfig(), LoggerConfig.getStream()],
    })
    const logger = new LoggerService(pinoLogger)
    logger.setContext(context)
    LoggerService.instances[context] = logger
    return LoggerService.instances[context]
  }
}

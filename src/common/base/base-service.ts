import { LoggerService } from '../../core/logger/logger.service'

export class BaseService {
  protected logger = LoggerService.getInstance(BaseService.name)

  constructor(context: string) {
    this.logger.setContext(context)
  }
}

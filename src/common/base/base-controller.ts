import { LoggerService } from '../../core/logger/logger.service'
import { AbstractController } from '../dto/abstract-controller.dto'

export class BaseController extends AbstractController {
  protected logger = LoggerService.getInstance(BaseController.name)

  constructor(context: string) {
    super()
    this.logger.setContext(context)
  }
}

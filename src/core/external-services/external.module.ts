import { Module } from '@nestjs/common'
import { MensajeriaModule } from './mensajeria/mensajeria.module'
import { IopModule } from './iop/iop.module'

@Module({
  imports: [MensajeriaModule, IopModule],
  providers: [],
  exports: [MensajeriaModule, IopModule],
})
export class ExternalServicesModule {}

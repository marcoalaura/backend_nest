import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'

@Module({
  imports: [ParametroModule],
})
export class ApplicationModule {}

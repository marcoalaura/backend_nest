import { Module } from '@nestjs/common'
import { SegipModule } from './segip/segip.module'
import { SinModule } from './sin/sin.module'

@Module({
  imports: [SegipModule, SinModule],
  providers: [],
  exports: [SegipModule, SinModule],
})
export class IopModule {}

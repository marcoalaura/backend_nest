import { Module } from '@nestjs/common'
import { AuthorizationConfigModule } from './authorization/authorization.module'
import { DataBaseModule } from './database/database.module'

@Module({
  imports: [DataBaseModule, AuthorizationConfigModule],
})
export class ConfigCoreModule {}

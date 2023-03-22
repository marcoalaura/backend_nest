import { Module } from '@nestjs/common'
import { SinService } from './sin.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_SIN_URL'),
        headers: {
          authorization: `Bearer ${configService.get('IOP_SIN_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [SinService],
  exports: [SinService],
})
export class SinModule {}

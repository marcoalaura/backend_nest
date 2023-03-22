import { Module } from '@nestjs/common'
import { MensajeriaService } from './mensajeria.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('MSJ_URL'),
        headers: {
          authorization: `Bearer ${configService.get('MSJ_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [MensajeriaService],
  exports: [MensajeriaService],
})
export class MensajeriaModule {}

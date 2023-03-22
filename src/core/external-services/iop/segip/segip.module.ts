import { HttpModule } from '@nestjs/axios'
import { SegipService } from './segip.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_SEGIP_URL'),
        headers: {
          authorization: `Bearer ${configService.get('IOP_SEGIP_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [SegipService],
  exports: [SegipService],
})
export class SegipModule {}

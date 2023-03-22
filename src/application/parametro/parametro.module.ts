import { Module } from '@nestjs/common'
import { ParametroController } from './parametro.controller'
import { ParametroService } from './parametro.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParametroRepository } from './parametro.repository'
import { Parametro } from './parametro.entity'

@Module({
  controllers: [ParametroController],
  providers: [ParametroService, ParametroRepository],
  imports: [TypeOrmModule.forFeature([Parametro])],
})
export class ParametroModule {}

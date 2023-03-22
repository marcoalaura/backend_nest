import { IsOptional } from '../validation'

export class SuccessResponseDto {
  @IsOptional()
  finalizado: boolean

  @IsOptional()
  mensaje: string

  @IsOptional()
  datos: any
}

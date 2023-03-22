import { IsNotEmpty, IsObject, IsString } from '../../../common/validation'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'

export class PropiedadesDto {
  @IsString()
  icono?: string

  @IsString()
  descripcion?: string

  @IsString()
  color_light?: string

  @IsString()
  color_dark?: string
}

export class CrearModuloDto {
  id: string
  @IsNotEmpty()
  @IsString()
  label: string

  @IsNotEmpty()
  @IsString()
  url: string

  @IsNotEmpty()
  @IsString()
  nombre: string

  @IsObject()
  propiedades: PropiedadesDto

  fidModulo?: string
  estado?: string
}

export class FiltroModuloDto extends PaginacionQueryDto {
  readonly seccion?: boolean
}

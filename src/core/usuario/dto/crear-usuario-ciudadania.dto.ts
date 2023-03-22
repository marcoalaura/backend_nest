import { Transform } from 'class-transformer'
import { IsNotEmpty, NroDocumento } from '../../../common/validation'

export class CrearUsuarioCiudadaniaDto {
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  usuario: string

  estado?: string

  @IsNotEmpty()
  roles: Array<string>

  @Transform(() => true)
  ciudadaniaDigital?: boolean = true

  usuarioCreacion?: string
}

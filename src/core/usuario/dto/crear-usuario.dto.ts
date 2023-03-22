import {
  IsEmail,
  IsNotEmpty,
  CorreoLista,
  ValidateNested,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'
import { Type } from 'class-transformer'

export class CrearUsuarioDto {
  usuario?: string

  estado?: string

  contrasena?: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  ciudadaniaDigital?: boolean = false

  @IsNotEmpty()
  roles: Array<string>

  usuarioCreacion?: string
}

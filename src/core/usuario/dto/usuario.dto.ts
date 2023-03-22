import { IsNotEmpty } from '../../../common/validation'
import { PersonaDto } from './persona.dto'
export class UsuarioDto {
  @IsNotEmpty()
  usuario: string

  @IsNotEmpty()
  contrasena: string

  estado?: string

  persona: PersonaDto

  usuarioCreacion?: string
  /*   @ApiProperty()
  email: string;

  @ApiProperty()
  code_activacion: string;

  @ApiProperty()
  last_login: string;

  @ApiProperty()
  end_last_login: string; */
}

import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsString,
} from '../../../common/validation'

export class CrearUsuarioCuentaDto {
  nombres: string
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}

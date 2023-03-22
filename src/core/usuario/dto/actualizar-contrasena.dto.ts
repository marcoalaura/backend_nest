import { IsNotEmpty, IsString } from '../../../common/validation'

export class ActualizarContrasenaDto {
  @IsString()
  @IsNotEmpty()
  contrasenaActual: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}

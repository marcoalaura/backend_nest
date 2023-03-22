import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsString,
} from '../../../common/validation'

export class RecuperarCuentaDto {
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string
}

export class ValidarRecuperarCuentaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string
}

export class ActivarCuentaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string
}

export class NuevaContrasenaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}

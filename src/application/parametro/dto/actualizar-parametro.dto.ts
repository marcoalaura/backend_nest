import { IsNotEmpty } from '../../../common/validation'

export class ActualizarParametroDto {
  @IsNotEmpty()
  codigo: string
  @IsNotEmpty()
  nombre: string
  @IsNotEmpty()
  grupo: string
  descripcion: string
  estado?: string
}

import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsString,
  NombreApellido,
  NroDocumento,
  IsDateString,
  ValidateIf,
} from '../../../common/validation'

export class PersonaDto {
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  nroDocumento: string

  tipoDocumento?: string

  @IsNotEmpty()
  @NombreApellido()
  nombres: string

  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  primerApellido?: string

  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  segundoApellido?: string

  @IsDateString()
  fechaNacimiento?: Date | null
}

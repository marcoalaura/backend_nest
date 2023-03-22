import { Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception'
import dayjs from 'dayjs'
import { PersonaDto } from '../../../usuario/dto/persona.dto'
import { UtilService } from '../../../../common/lib/util.service'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

// Respuestas codigos segip
enum CodigoResSegipEnum {
  NO_PROCESADO = '0', // No se realizo la búsqueda
  NO_ENCONTRADO = '1', // No se encontró el registro [persona ú documento]
  ENCONTRADO = '2', // Encontrado
  MULTIPLICIDAD = '3', // Se encontró más de un registro [persona ú documento]
  OBSERVADO = '4', // Registro con observacion
}

// Respuestas codigos datos contrastacion
enum EstadosDatosEnum {
  NO_CORRESPONDE = 0, // Dato no coincide
  CORRESPONDE = 1, // Dato coincide
  NO_VERIFICADO = 2, // Dato no verificado
}

@Injectable()
export class SegipService {
  constructor(private http: HttpService) {}

  /**
   * @title Contrastación
   * @description Metodo para verificar si la información de una persona coincide con un registro en el SEGIP
   * @param datosPersona Objeto de datos con la información de la persona
   * @param retornarPrimerError Bandera para retornar primer error en contrastacion o retornar todos
   */
  async contrastar(datosPersona: PersonaDto, retornarPrimerError = true) {
    try {
      const datosCampos = this.armarDatosPersona(datosPersona)
      const campos = UtilService.armarQueryParams(datosCampos)

      const urlContrastacion = encodeURI(
        `/v2/personas/contrastacion?tipo_persona=1&lista_campo={ ${campos} }`
      )
      const respuesta = firstValueFrom(
        await this.http
          .get(urlContrastacion)
          .pipe(map((response) => response.data))
      )
      const resultado = (await respuesta)
        ?.ConsultaDatoPersonaContrastacionResult
      if (resultado) {
        if (resultado.CodigoRespuesta === CodigoResSegipEnum.ENCONTRADO) {
          const datosRespuesta = JSON.parse(
            resultado.ContrastacionEnFormatoJson
          )
          const observaciones = this.procesarRespuesta(
            datosRespuesta,
            retornarPrimerError
          )
          const exito = observaciones.length === 0
          const mensaje = exito
            ? resultado.DescripcionRespuesta
            : `No coincide ${observaciones.join(', ')}`
          return this.armarRespuesta(exito, mensaje)
        } else if (
          [
            CodigoResSegipEnum.NO_PROCESADO,
            CodigoResSegipEnum.NO_ENCONTRADO,
            CodigoResSegipEnum.MULTIPLICIDAD,
            CodigoResSegipEnum.OBSERVADO,
          ].includes(resultado.CodigoRespuesta)
        ) {
          return this.armarRespuesta(false, resultado.DescripcionRespuesta)
        }
      }
    } catch (error) {
      throw new ExternalServiceException('SEGIP:CONTRASTACION', error)
    }
  }

  armarDatosPersona(datosPersona) {
    const datosCampos = {
      Complemento: '',
      NumeroDocumento: datosPersona.nroDocumento,
      Nombres: datosPersona.nombres,
      PrimerApellido: datosPersona.primerApellido || '--',
      SegundoApellido: datosPersona.segundoApellido || '--',
      FechaNacimiento: dayjs(datosPersona.fechaNacimiento).format('DD/MM/YYYY'),
    }
    if (datosPersona.nroDocumento.includes('-')) {
      datosCampos.NumeroDocumento = datosPersona.nroDocumento.split('-').shift()
      datosCampos.Complemento = datosPersona.nroDocumento.split('-').pop() || ''
    }
    return datosCampos
  }

  procesarRespuesta(respuesta, retornarPrimerError) {
    const datosIncorrectos: Array<string> = []
    if (respuesta?.NumeroDocumento === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Número de documento')
    }
    if (respuesta?.Complemento === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Complemento')
    }
    if (respuesta?.Nombres === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Nombre(s)')
    }
    if (respuesta?.PrimerApellido === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Primer Apellido')
    }
    if (respuesta?.SegundoApellido === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Segundo Apellido')
    }
    if (respuesta?.FechaNacimiento === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push('Fecha de Nacimiento')
    }
    if (datosIncorrectos.length > 0) {
      return retornarPrimerError ? [datosIncorrectos[0]] : datosIncorrectos
    }
    return []
  }

  armarRespuesta(exito, mensaje) {
    return {
      finalizado: exito,
      mensaje: `Servicio Segip: ${mensaje}`,
    }
  }
}

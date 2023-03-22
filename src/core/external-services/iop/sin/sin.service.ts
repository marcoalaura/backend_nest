import { BaseExternalService } from '../../../../common/base/base-external-service'
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception'
import { Injectable } from '@nestjs/common'
import { SINCredencialesDTO } from './credenciales.dto'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { LoginResponse } from './types'

@Injectable()
export class SinService extends BaseExternalService {
  constructor(protected http: HttpService) {
    super(SinService.name, http, 'SIN')
  }

  /**
   * @title Login
   * @description Metodo para verificar si la información de la empresa existe en el servicio del SIN
   */
  async login(datosSIN: SINCredencialesDTO) {
    const config: AxiosRequestConfig = {
      url: '/login',
      method: 'post',
      data: {
        nit: datosSIN.Nit,
        usuario: datosSIN.Usuario,
        clave: datosSIN.Contrasena,
      },
    }

    const requestResult = await this.request(config)
    const responseStatus = requestResult.status

    if (responseStatus !== 200 || !requestResult.body) {
      const errMsg = `Ocurrió un error inesperado, por favor inténtelo nuevamente y si el problema persiste comuníquese con el encargado de sistemas.`
      return this.errorResponse(errMsg)
    }

    const body = requestResult.body as LoginResponse

    if (
      !body.Estado &&
      body.Mensaje &&
      body.Mensaje.includes('You cannot consume this service')
    ) {
      const errMsg = `No tiene permisos para usar este servicio.`
      return this.errorResponse(errMsg)
    }

    if (
      !body.Estado &&
      body.Mensaje &&
      body.Mensaje.includes('no API found with those values')
    ) {
      const errMsg = `No se encontró el servicio solicitado.`
      return this.errorResponse(errMsg)
    }

    if (!body.Autenticado) {
      const errMsg = body.Mensaje || 'Error desconocido'
      return this.errorResponse(errMsg)
    }

    return this.successResponse(body.Estado)
  }

  private successResponse(mensaje: string) {
    return {
      resultado: true,
      mensaje,
    }
  }

  private errorResponse(mensaje: string) {
    return {
      resultado: false,
      mensaje: new ExternalServiceException(this.serviceName, mensaje).message,
    }
  }
}

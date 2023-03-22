import { BaseService } from '../../../common/base/base-service'
import { Injectable, Query } from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import { FiltrosPoliticasDto } from '../dto/filtros-politicas.dto'
import { ModuloService } from '../service/modulo.service'

@Injectable()
export class AuthorizationService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    private readonly moduloService: ModuloService
  ) {
    super(AuthorizationService.name)
  }

  async listarPoliticas(@Query() paginacionQueryDto: FiltrosPoliticasDto) {
    const { limite, pagina, filtro, aplicacion } = paginacionQueryDto

    const politicas = await this.authZManagerService.getPolicy()
    
    let result = politicas.map((politica) => ({
      sujeto: politica[0],
      objeto: politica[1],
      accion: politica[2],
      app: politica[3],
    }))

    if (filtro) {
      result = result.filter(
        (r) => r.sujeto.search(filtro) >= 0 || r.objeto.search(filtro) >= 0
      )
    }
    if (aplicacion) {
      result = result.filter((r) => r.app == aplicacion)
    }

    if (!limite || !pagina) {
      return [result, result.length]
    }
    const i = limite * (pagina - 1)
    const f = limite * pagina

    const subset = result.slice(i, f)
    return [subset, result.length]
  }

  async crearPolitica(politica) {
    const { sujeto, objeto, accion, app } = politica
    await this.authZManagerService.addPolicy(sujeto, objeto, accion, app)
    return politica
  }

  async actualizarPolitica(politica, politicaNueva) {
    const { sujeto, objeto, accion, app } = politicaNueva
    await this.eliminarPolitica(politica)
    await this.authZManagerService.addPolicy(sujeto, objeto, accion, app)
  }

  async eliminarPolitica(politica) {
    const { sujeto, objeto, accion, app } = politica
    await this.authZManagerService.removePolicy(sujeto, objeto, accion, app)
    return politica
  }

  async obtenerRoles() {
    return await this.authZManagerService.getFilteredPolicy(3, 'frontend')
  }

  async obtenerPermisosPorRol(rol: string) {
    const politicas = await this.authZManagerService.getFilteredPolicy(
      3,
      'frontend'
    )
    const modulos = await this.moduloService.listarTodo()
    const politicasRol = politicas.filter((politica) => politica[0] === rol)
    return modulos
      .map((modulo) => ({
        ...modulo,
        subModulo: modulo.subModulo.filter((subModulo) =>
          politicasRol.some((politica) => politica[1] === subModulo.url)
        ),
      }))
      .filter((modulo) => modulo.subModulo.length > 0)
  }
}

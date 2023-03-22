import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { ModuloRepository } from '../repository/modulo.repository'
import { CrearModuloDto, FiltroModuloDto } from '../dto/crear-modulo.dto'
import { Status } from '../../../common/constants'
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception'
import { Messages } from '../../../common/constants/response-messages'

@Injectable()
export class ModuloService extends BaseService {
  constructor(
    @Inject(ModuloRepository)
    private moduloRepositorio: ModuloRepository
  ) {
    super(ModuloService.name)
  }

  async listar(paginacionQueryDto: FiltroModuloDto) {
    return await this.moduloRepositorio.listar(paginacionQueryDto)
  }

  async listarTodo() {
    return await this.moduloRepositorio.obtenerModulosSubmodulos()
  }

  async crear(moduloDto: CrearModuloDto, usuarioAuditoria: string) {
    return await this.moduloRepositorio.crear(moduloDto, usuarioAuditoria)
  }

  async actualizar(moduloDto: CrearModuloDto, usuarioAuditoria: string) {
    return await this.moduloRepositorio.actualizar(moduloDto, usuarioAuditoria)
  }

  async eliminar(moduloDto: CrearModuloDto) {
    return await this.moduloRepositorio.eliminar(moduloDto)
  }

  async activar(idModulo, usuarioAuditoria: string) {
    const modulo = await this.moduloRepositorio.buscarPorId(idModulo)
    if (!modulo) {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const moduloActualizado = await this.moduloRepositorio.actualizar(
      {
        id: idModulo,
        estado: Status.ACTIVE,
      },
      usuarioAuditoria
    )
    return {
      id: moduloActualizado.id,
      estado: moduloActualizado.estado,
    }
  }

  async inactivar(idModulo, usuarioAuditoria: string) {
    const modulo = await this.moduloRepositorio.buscarPorId(idModulo)
    if (!modulo) {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const moduloActualizado = await this.moduloRepositorio.actualizar(
      {
        id: idModulo,
        estado: Status.INACTIVE,
      },
      usuarioAuditoria
    )
    return {
      id: moduloActualizado.id,
      estado: moduloActualizado.estado,
    }
  }
}

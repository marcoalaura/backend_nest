import { DataSource } from 'typeorm'
import { Status } from '../../../common/constants'
import { Injectable } from '@nestjs/common'
import { Rol } from '../entity/rol.entity'

@Injectable()
export class RolRepository {
  constructor(private dataSource: DataSource) {}

  async listar() {
    return await this.dataSource
      .getRepository(Rol)
      .createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol', 'rol.nombre'])
      .where({ estado: Status.ACTIVE })
      .getMany()
  }

  async buscarPorNombreRol(rol: string) {
    return await this.dataSource
      .getRepository(Rol)
      .createQueryBuilder('rol')
      .where({ rol: rol })
      .getOne()
  }

  async listarRolesPorUsuario(idUsuario: number) {
    return await this.dataSource
      .getRepository(Rol)
      .createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol'])
      .where({ estado: Status.ACTIVE, usuarioRol: idUsuario })
      .getMany()
  }
}

import { UsuarioRol } from '../entity/usuario-rol.entity'
import { DataSource } from 'typeorm'
import { Usuario } from '../../usuario/entity/usuario.entity'
import { Rol } from '../entity/rol.entity'
import { Status } from '../../../common/constants'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsuarioRolRepository {
  constructor(private dataSource: DataSource) {}

  async obtenerRolesPorUsuario(idUsuario: string) {
    return await this.dataSource
      .getRepository(UsuarioRol)
      .createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuarioRol.id_usuario = :idUsuario', { idUsuario })
      .getMany()
  }

  async activar(idUsuario, roles, usuarioActualizacion) {
    return await this.dataSource
      .getRepository(UsuarioRol)
      .createQueryBuilder()
      .update(UsuarioRol)
      .set({
        estado: Status.ACTIVE,
        usuarioModificacion: usuarioActualizacion,
      })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute()
  }

  async inactivar(idUsuario, roles, usuarioActualizacion) {
    return await this.dataSource
      .getRepository(UsuarioRol)
      .createQueryBuilder()
      .update(UsuarioRol)
      .set({
        estado: Status.INACTIVE,
        usuarioModificacion: usuarioActualizacion,
      })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute()
  }

  async crear(idUsuario, roles, usuarioAuditoria) {
    const usuarioRoles: UsuarioRol[] = roles.map((idRol) => {
      const usuario = new Usuario()
      usuario.id = idUsuario

      const rol = new Rol()
      rol.id = idRol

      const usuarioRol = new UsuarioRol()
      usuarioRol.usuario = usuario
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    return await this.dataSource.getRepository(UsuarioRol).save(usuarioRoles)
  }
}

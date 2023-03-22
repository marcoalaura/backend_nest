import { DataSource } from 'typeorm'
import { Modulo, Propiedades } from '../entity/modulo.entity'
import { CrearModuloDto, FiltroModuloDto } from '../dto/crear-modulo.dto'
import { Injectable } from '@nestjs/common'
import { Status } from '../../../common/constants'

@Injectable()
export class ModuloRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string): Promise<Modulo | null> {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .where({ id: id })
      .getOne()
  }

  async listar(paginacionQueryDto: FiltroModuloDto) {
    const { limite, saltar, filtro, seccion } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .leftJoin('modulo.fidModulo', 'fidModulo')
      .select([
        'modulo.id',
        'modulo.label',
        'modulo.url',
        'modulo.nombre',
        'modulo.propiedades',
        'modulo.estado',
        'fidModulo.id',
      ])
      .take(limite)
      .skip(saltar)
      .orderBy('modulo.id', 'ASC')

    if (filtro) {
      query.andWhere(
        '(modulo.label ilike :filtro or modulo.nombre ilike :filtro)',
        { filtro: `%${filtro?.toLowerCase()}%` }
      )
    }
    if (seccion) {
      query.andWhere('(modulo.fidModulo is null)')
    }
    return await query.getManyAndCount()
  }

  async listarTodo() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .getMany()
  }

  async obtenerModulosSubmodulos() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .leftJoinAndSelect(
        'modulo.subModulo',
        'subModulo',
        'subModulo.estado = :estado',
        {
          estado: Status.ACTIVE,
        }
      )
      .orderBy('subModulo.id', 'ASC')
      .select([
        'modulo.id',
        'modulo.label',
        'modulo.url',
        'modulo.nombre',
        'modulo.propiedades',
        'modulo.estado',
        'subModulo.id',
        'subModulo.label',
        'subModulo.url',
        'subModulo.nombre',
        'subModulo.propiedades',
        'subModulo.estado',
      ])
      .where('modulo.fid_modulo is NULL')
      .andWhere('modulo.estado = :estado', {
        estado: Status.ACTIVE,
      })
      .orderBy('modulo.id', 'ASC')
      .getMany()
  }

  async crear(moduloDto: CrearModuloDto, usuarioAuditoria: string) {
    const propiedades: Propiedades = {
      icono: moduloDto.propiedades.icono,
      color_dark: moduloDto.propiedades.color_dark,
      color_light: moduloDto.propiedades.color_light,
      descripcion: moduloDto.propiedades.descripcion,
    }

    //console.log('Datos........ para modulo......................', moduloDto)
    const modulo = new Modulo()
    modulo.label = moduloDto.label
    modulo.url = moduloDto.url
    modulo.nombre = moduloDto.nombre
    modulo.propiedades = propiedades
    modulo.usuarioCreacion = usuarioAuditoria
    modulo.fechaCreacion = new Date()
    if (moduloDto.fidModulo) {
      const em = new Modulo()
      em.id = moduloDto.fidModulo
      modulo.fidModulo = em
    }

    //console.log('Datos........ para guardar modulo......................', modulo)

    return await this.dataSource.getRepository(Modulo).save(modulo)
  }

  async actualizar(
    moduloDto: Partial<CrearModuloDto>,
    usuarioAuditoria: string
  ) {
    return await this.dataSource.getRepository(Modulo).save(
      new Modulo({
        id: moduloDto.id,
        label: moduloDto.label,
        url: moduloDto.url,
        nombre: moduloDto.nombre,
        propiedades: moduloDto.propiedades,
        idModulo: moduloDto.fidModulo,
        estado: moduloDto.estado,
        usuarioModificacion: usuarioAuditoria,
      })
    )
  }

  async eliminar(moduloDto: CrearModuloDto) {
    return await this.dataSource.getRepository(Modulo).delete(moduloDto.id)
  }
}

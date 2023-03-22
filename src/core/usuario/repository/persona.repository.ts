import { DataSource } from 'typeorm'
import { Persona } from '../entity/persona.entity'
import { PersonaDto } from '../dto/persona.dto'
import { Status } from '../../../common/constants'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PersonaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPersonaPorCI(persona: PersonaDto) {
    return await this.dataSource
      .getRepository(Persona)
      .createQueryBuilder('persona')
      .where('persona.nro_documento = :ci', { ci: persona.nroDocumento })
      .getOne()
  }

  async buscarPersonaPorDocumento(
    tipoDocumento: string,
    numeroDocumento: string
  ) {
    return await this.dataSource
      .getRepository(Persona)
      .createQueryBuilder('p')
      .where('p.nro_documento = :numeroDocumento', { numeroDocumento })
      .andWhere('p.tipo_documento = :tipoDocumento', { tipoDocumento })
      .andWhere('p.estado = :estado', { estado: Status.ACTIVE })
      .getOne()
  }
}

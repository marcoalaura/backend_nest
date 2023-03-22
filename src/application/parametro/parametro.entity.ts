import { UtilService } from '../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../common/entity/auditoria.entity'
import { Status } from '../../common/constants'

dotenv.config()

export const ParametroEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(ParametroEstado))
@Entity({ schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Parametro extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 15, type: 'varchar', unique: true })
  codigo: string

  @Column({ length: 50, type: 'varchar' })
  nombre: string

  @Column({ length: 15, type: 'varchar' })
  grupo: string

  @Column({ length: 255, type: 'varchar' })
  descripcion: string

  constructor(data?: Partial<Parametro>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ParametroEstado.ACTIVE
  }
}

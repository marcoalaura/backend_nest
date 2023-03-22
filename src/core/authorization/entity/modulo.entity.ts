import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

dotenv.config()

export type Propiedades = {
  icono?: string
  descripcion?: string
  color_light?: string
  color_dark?: string
}

export const ModuloEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(ModuloEstado))
@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Modulo extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  label: string

  @Column({ length: 50, type: 'varchar', unique: true })
  url: string

  @Column({ length: 50, type: 'varchar', unique: true })
  nombre: string

  @Column({ type: 'jsonb' })
  propiedades: Propiedades

  @Column({
    name: 'fid_modulo',
    type: 'bigint',
    nullable: true,
  })
  idModulo?: string | null

  @OneToMany(() => Modulo, (modulo) => modulo.fidModulo)
  subModulo: Modulo[]

  @ManyToOne(() => Modulo, (modulo) => modulo.subModulo)
  @JoinColumn({ name: 'fid_modulo', referencedColumnName: 'id' })
  fidModulo: Modulo

  constructor(data?: Partial<Modulo>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ModuloEstado.ACTIVE
  }
}

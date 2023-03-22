import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transacccion } from '../constants'

export abstract class AuditoriaEntity extends BaseEntity {
  @Column({
    name: '_estado',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  estado: string

  @Column('varchar', {
    name: '_transaccion',
    length: 30,
    nullable: false,
  })
  transaccion: string

  @Column('bigint', {
    name: '_usuario_creacion',
    nullable: false,
  })
  usuarioCreacion: string

  @CreateDateColumn({
    name: '_fecha_creacion',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
  })
  fechaCreacion: Date

  @Column('bigint', {
    name: '_usuario_modificacion',
    nullable: true,
  })
  usuarioModificacion?: string | null

  @UpdateDateColumn({
    name: '_fecha_modificacion',
    type: 'timestamp without time zone',
    nullable: true,
  })
  fechaModificacion?: Date | null

  @BeforeInsert()
  insertarTransaccion() {
    this.transaccion = this.transaccion || Transacccion.CREAR
  }

  @BeforeUpdate()
  actualizarTransaccion() {
    this.transaccion = this.transaccion || Transacccion.ACTUALIZAR
  }

  protected constructor(data?: Partial<AuditoriaEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}

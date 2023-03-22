import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity'
import { Persona } from './persona.entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

dotenv.config()

export const UsuarioEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
  CREATE: Status.CREATE,
  PENDING: Status.PENDING,
}

@Check(UtilService.buildStatusCheck(UsuarioEstado))
@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Usuario extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  usuario: string

  @Column({ length: 255, type: 'varchar' })
  contrasena: string

  @Column({ name: 'ciudadania_digital', type: 'boolean', default: false })
  ciudadaniaDigital: boolean

  @Column({ name: 'correo_electronico', type: 'varchar', nullable: true })
  correoElectronico?: string | null

  @Column({
    type: 'integer',
    default: 0,
  })
  intentos: number

  @Index()
  @Column({
    name: 'codigo_desbloqueo',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoDesbloqueo?: string | null

  @Index()
  @Column({
    name: 'codigo_recuperacion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoRecuperacion?: string | null

  @Index()
  @Column({
    name: 'codigo_transaccion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoTransaccion?: string | null

  @Index()
  @Column({
    name: 'codigo_activacion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoActivacion?: string | null

  @Column({
    name: 'fecha_bloqueo',
    type: 'timestamp without time zone',
    nullable: true,
  })
  fechaBloqueo?: Date | null

  @Column({
    name: 'id_persona',
    type: 'bigint',
    nullable: false,
  })
  idPersona: string

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRol: UsuarioRol[]

  @ManyToOne(() => Persona, (persona) => persona.usuarios, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona

  constructor(data?: Partial<Usuario>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UsuarioEstado.ACTIVE
  }
}

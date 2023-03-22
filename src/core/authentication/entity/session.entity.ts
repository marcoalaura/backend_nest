import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from 'typeorm'
import dotenv from 'dotenv'
import { ISession } from 'connect-typeorm'

dotenv.config()

@Entity()
export class Session implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt = Date.now()

  @PrimaryColumn('varchar', { length: 255 })
  public id = ''

  @Column('text')
  public json = ''

  @DeleteDateColumn()
  public destroyedAt?: Date
}

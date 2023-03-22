import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class CasbinRule extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public ptype: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v0: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v1: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v2: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v3: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v4: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v5: string | null

  @Column({
    nullable: true,
    type: 'varchar',
  })
  public v6: string | null

  constructor(data?: Partial<CasbinRule>) {
    super()
    if (data) Object.assign(this, data)
  }
}

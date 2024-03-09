import {UUID} from 'node:crypto'
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Establishment} from './establishment.entity'

@Entity()
export class EstablishmentType {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'uuid', unique: true})
  uuid: UUID
  @Column({type: 'varchar', unique: true})
  name: string
  @Column({type: 'varchar'})
  description: string
  @OneToMany(() => Establishment, (establishment) => establishment.establishmentType)
  establishments: Establishment[]
}

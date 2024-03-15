import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Establishment} from './establishment.entity'
import {UUID} from 'crypto'
import {EstablishmentTypeEnum} from '../../shared/establishment/enums/establishment-type.enum'

@Entity()
export class EstablishmentType {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID
  @Column({type: 'varchar', unique: true})
  name: EstablishmentTypeEnum
  @Column({type: 'varchar'})
  description: string
  @OneToMany(() => Establishment, (establishment) => establishment.establishmentType)
  establishments: Establishment[]
}

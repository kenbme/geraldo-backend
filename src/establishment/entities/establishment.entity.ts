import {UUID} from 'crypto'
import {User} from 'src/user/entities/user.entity'
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {EstablishmentType} from './establishment.type.entity'

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  uuid: UUID
  @OneToOne(() => User)
  @JoinColumn()
  user: User
  @Column({type: 'varchar'})
  areaCode: string
  @Column({type: 'varchar'})
  phone: string
  @Column({type: 'boolean', default: false})
  alwaysOpen: number
  @ManyToOne(() => EstablishmentType, (establishmentType) => establishmentType.establishments)
  establishmentType: EstablishmentType
}

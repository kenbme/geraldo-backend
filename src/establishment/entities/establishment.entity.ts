import {UUID} from 'crypto'
import {User} from 'src/user/entities/user.entity'
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {EstablishmentType} from './establishment.type.entity'
import {Address} from 'src/addresses/entities/addresses.entity'

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: UUID
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
  @ManyToOne(() => Address)
  address: Address
}

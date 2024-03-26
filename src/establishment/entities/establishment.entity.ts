import { Schedule } from 'src/schedule/entities/schedule.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Address } from '../../address/entities/address.entity'
import { User } from '../../user/entities/user.entity'
import { EstablishmentType } from './establishment.type.entity'

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn()
  id: number
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
  @OneToOne(() => Schedule, (schedule) => schedule.establishment)
  @JoinColumn()
  schedule: Schedule[]
}

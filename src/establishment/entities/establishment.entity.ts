import {Avaliation} from '../../avaliation/entities/avaliation.entity'
import {Fuel} from '../../fuel/entities/fuel.entity'
import {Schedule} from '../../schedule/entities/schedule.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import {Address} from '../../address/entities/address.entity'
import {User} from '../../user/entities/user.entity'
import {EstablishmentType} from './establishment.type.entity'

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
  alwaysOpen: boolean
  @ManyToOne(() => EstablishmentType, (establishmentType) => establishmentType.establishments)
  establishmentType: EstablishmentType
  @OneToOne(() => Address)
  @JoinColumn()
  address: Address
  @OneToOne(() => Schedule, (schedule) => schedule.establishment)
  @JoinColumn()
  schedule: Schedule
  @OneToMany(() => Fuel, (fuel) => fuel.establishment)
  fuels: Fuel[]
  @OneToMany(() => Avaliation, (avaliation) => avaliation.establishment)
  avaliations: Avaliation[]
  @Column({type: 'integer', default: 5})
  grade: number
}

import {User} from '../../user/entities/user.entity'
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {EstablishmentType} from './establishment.type.entity'
import {Address} from '../../address/entities/address.entity'
import { Fuel } from 'src/fuel/entities/fuel.entity'
import { Length } from 'class-validator'

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
  @OneToMany (() => Fuel, (fuel) => fuel.establishment)
  fuels: Fuel[]
}

import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {City} from './cities.entity'
import {Address} from './address.entity'

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  name: string
  @OneToMany(() => City, (city) => city.state)
  cities: City[]
  @OneToMany(() => Address, (address) => address.state)
  addresses: Address[]
}

import {Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {State} from './state.entity'
import {Address} from './address.entity'

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar'})
  name: string
  @ManyToOne(() => State, (state) => state.cities)
  state: State
  @OneToMany(() => Address, (address) => address.city)
  addresses: Address[]
}

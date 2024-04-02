import {Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {State} from './state.entity'
import {City} from './cities.entity'
import {Establishment} from '../../establishment/entities/establishment.entity'

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Establishment)
  establishment: Establishment

  @Column({type: 'varchar'})
  postalCode: string

  @ManyToOne(() => State, (state) => state.addresses)
  state: State

  @ManyToOne(() => City, (city) => city.addresses)
  city: City

  @Column({type: 'varchar'})
  block: string

  @Column({type: 'varchar'})
  street: string

  @Column({type: 'varchar'})
  houseNumber: string

  @Column({type: 'decimal', nullable: true})
  longitude: number

  @Column({type: 'decimal', nullable: true})
  latitude: number
}

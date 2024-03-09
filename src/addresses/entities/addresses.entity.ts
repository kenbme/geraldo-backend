import {UUID} from 'crypto'
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import { State } from './state.entity'
import { City } from './cities.entity'

@Entity()
export class Addresses {
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({type: 'uuid'})
  uuid: UUID
  
  @Column({type: 'int'})
  establishmentId: number
  
  @Column({type: 'varchar'})
  postalCode: string
  
  @OneToOne(()=> State)
  @JoinColumn()
  state: State

  @OneToOne(()=> City)
  @JoinColumn()
  city: City
  
  @Column({type: 'varchar'})
  block: string

  @Column({type: 'varchar'})
  street: string

  @Column({type: 'varchar'})
  houseNumber: string


  @Column({type: 'decimal'})
  longitude: number

  @Column({type: 'decimal'})
  latitude: string

}

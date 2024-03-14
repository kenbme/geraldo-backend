import {UUID} from 'crypto'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {State} from './state.entity'

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'uuid'})
  uuid: UUID
  @Column({type: 'varchar', unique: true})
  name: string
  @ManyToOne(() => State, (state) => state.cities)
  state: State
}

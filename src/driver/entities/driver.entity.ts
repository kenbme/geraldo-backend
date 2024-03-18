import {UUID} from 'crypto'
import {User} from '../../user/entities/user.entity'
import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: UUID
  @ManyToOne(() => User, {eager: true})
  @JoinColumn()
  user: User
  @ManyToOne(() => Vehicle, {eager: true})
  @JoinColumn()
  vehicle: Vehicle
  @Column('boolean', {default: false})
  isOwner: boolean
}

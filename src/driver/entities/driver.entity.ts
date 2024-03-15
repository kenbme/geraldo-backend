import {UUID} from 'crypto'
import {User} from '../../user/entities/user.entity'
import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: UUID
  @OneToOne(() => User)
  @JoinColumn()
  user: User
  @ManyToMany(() => Vehicle, (vehicle) => vehicle.owners)
  vehicles: Vehicle[]
}

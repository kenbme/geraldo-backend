import { UUID } from 'crypto'
import { User } from 'src/user/entities/user.entity'
import { Vehicle } from 'src/vehicle/entities/vehicle.entity'
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'uuid'})
  uuid: UUID
  @OneToOne(() => User)
  @JoinColumn()
  user: User
  @ManyToMany(() => Vehicle, (vehicle) => vehicle.owners)
  vehicles: Vehicle[]
}

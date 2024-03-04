import {UUID} from 'crypto'
import {User} from 'src/user/entities/user.entity'
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'uuid'})
  uuid: UUID
  @OneToOne(() => User)
  user: User
}

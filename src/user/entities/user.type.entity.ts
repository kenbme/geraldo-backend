import {UUID} from 'node:crypto'
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {User} from './user.entity'

@Entity()
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: UUID
  @Column({type: 'varchar', unique: true})
  name: string
  @Column({type: 'varchar'})
  description: string
  @OneToMany(() => User, (user) => user.userType)
  users: User[]
}

import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Exclude} from 'class-transformer'
import {UUID} from 'node:crypto'
import {UserType} from './user.type.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'uuid', unique: true})
  uuid: UUID
  @Column({type: 'varchar', unique: true})
  username: string
  @Column({type: 'varchar'})
  @Exclude()
  password: string
  @Column({type: 'varchar'})
  name: string
  @Column({type: 'varchar', unique: true})
  email: string
  @Column({type: 'datetime'})
  birthday: Date
  @ManyToOne(() => UserType, (userType) => userType.users)
  userType: UserType
}

import {Exclude} from 'class-transformer'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {UserType} from './user.type.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  username: string
  @Column({type: 'varchar'})
  @Exclude()
  password: string
  @Column({type: 'boolean', default: true})
  resetPassword: boolean
  @Column({type: 'varchar'})
  name: string
  @Column({type: 'varchar', unique: true})
  email: string
  @Column({type: 'date', nullable: true})
  birthday: Date
  @ManyToOne(() => UserType, (userType) => userType.users, {eager: true})
  userType: UserType
}

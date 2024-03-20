import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {User} from './user.entity'
import {UserTypeEnum} from '../../shared/user/enums/user-type.enum'

@Entity()
export class UserType {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  name: UserTypeEnum
  @Column({type: 'varchar'})
  description: string
  @OneToMany(() => User, (user) => user.userType)
  users: User[]
}

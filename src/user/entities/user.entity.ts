import { Exclude } from 'class-transformer'
import { Avaliation } from 'src/avaliation/entities/avaliation.entity'
import { Call } from 'src/call/entites/call.entity'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserType } from './user.type.entity'

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
  @OneToMany(() => Avaliation, (avaliation) => avaliation.establishment)
  avaliations: Avaliation[]
  @ManyToOne(() => Call, (call) => call.user)
  calls: Call[]
}

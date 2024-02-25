import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import { UserRole } from '../enums/UserRole'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  email: string
  @Column({type: 'varchar'})
  name: string
  @Column({type: 'varchar'})
  password: string
  @Column({type: 'enum', enum: UserRole})
  role: string
}

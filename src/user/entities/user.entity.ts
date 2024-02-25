import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import {Exclude} from 'class-transformer'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  email: string
  @Column({type: 'varchar'})
  name: string
  @Column({type: 'varchar'})
  @Exclude()
  password: string
  @Column({type: 'varchar'})
  role: string
}

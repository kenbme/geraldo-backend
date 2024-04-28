import {Establishment} from '../../establishment/entities/establishment.entity'
import {User} from '../../user/entities/user.entity'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Avaliation {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(() => Establishment, (establishment) => establishment.avaliations)
  establishment: Establishment
  @ManyToOne(() => User, (user) => user.avaliations)
  user: User
  @Column({type: 'varchar'})
  comment: string
  @Column({type: 'integer'})
  grade: number
  @Column({type: 'date'})
  date: Date
}

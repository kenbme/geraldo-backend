import { Establishment } from "src/establishment/entities/establishment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avaliation{
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Establishment, (establishment) => establishment.avaliations)
    establishment: Establishment
    @OneToMany(() => User, (user) => user.avaliations)
    user: User
    @Column({type:'varchar'})
    comment: string
    @Column({type:'integer'})
    grade: number
    @Column({ type: 'date' })
    date: Date
}
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Establishment } from "../../establishment/entities/establishment.entity";

@Entity()
export class Avaliation{
    @PrimaryGeneratedColumn()
    id: number
    @OneToMany(() => Establishment, (establishment) => establishment.avaliations)
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
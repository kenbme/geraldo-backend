import { Establishment } from "src/establishment/entities/establishment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Call{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type: 'decimal'})
    longitude: number

    @Column({type: 'decimal'})
    latitude: number

    @Column({type: 'varchar'})
    comment: string

    @OneToMany(() => Establishment, (establishment) => establishment.acceptedCalls)
    @JoinColumn()
    establishmentAccepted: Establishment

    @OneToMany(() => User, (user) => user.calls)
    @JoinColumn()
    user: User

    @ManyToMany(() => Establishment, (establishment) => establishment.calls)
    @JoinColumn()
    establishments: Establishment[]
}
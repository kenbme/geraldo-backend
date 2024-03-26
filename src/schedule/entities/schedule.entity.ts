import { Establishment } from "src/establishment/entities/establishment.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number
    @Column({type: 'varchar'})
    working_days: string
    @Column({type: 'varchar'})
    morning_opening: string
    @Column({type: 'varchar'})
    morning_closing:string
    @Column({type: 'varchar'})
    afternoon_opening:string
    @Column({type: 'varchar'})
    afternoon_closing:string
    @Column({type: 'varchar'})
    evening_opening:string
    @Column({type: 'varchar'})
    evening_closing:string
    @OneToOne(() => Establishment, (establishment) => establishment.schedule)
    @JoinColumn()
    establishment: Establishment
}
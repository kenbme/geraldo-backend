import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class Shift{
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: 'time' })
    start:string
    @Column({ type: 'time' })
    finish:string
    @OneToMany(() => Schedule, (schedule) => schedule.shifts)
    @JoinColumn()
    schedule: Schedule;
}
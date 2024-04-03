import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class Shift {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'time' })
    start: string;
    @Column({ type: 'time' })
    finish: string;
    @ManyToOne(() => Schedule, (schedule) => schedule.shifts)
    schedule: Schedule;
}

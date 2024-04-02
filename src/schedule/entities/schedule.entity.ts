import { Establishment } from "src/establishment/entities/establishment.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shift } from "./shift.entity";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: 'varchar' })
    working_days: string
    @ManyToMany(() => Establishment, (establishment) => establishment.schedule)
    @JoinColumn()
    establishment: Establishment;
    @ManyToOne(() => Shift, (shift: { schedule: any; }) => shift.schedule)
    @JoinColumn()
    shifts: Shift[];
}

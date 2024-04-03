import { Establishment } from "src/establishment/entities/establishment.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shift } from "./shift.entity";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number
    @OneToOne(() => Establishment, (establishment) => establishment.schedule)
    @JoinColumn()
    establishment: Establishment
    @OneToMany(() => Shift, (shift) => shift.schedule)
    shifts: Shift[]
}
